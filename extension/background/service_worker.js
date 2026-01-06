const DOMAIN_COOLDOWN_MIN = 15;
const alertedTabs = new Set();
const domainCooldowns = {};

const SUSPICIOUS_TLDS = ["zip", "mov", "tk", "ga", "ml", "cf", "gq"];

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

/* ---------------- DOMAIN HEURISTICS ---------------- */

function domainHeuristics(hostname) {
  const length = hostname.length;
  const hyphens = (hostname.match(/-/g) || []).length;
  const numbers = (hostname.match(/[0-9]/g) || []).length;

  return {
    domainLength: length,
    hyphenCount: hyphens,
    numericRatio: numbers / Math.max(length, 1),
    suspiciousTLD: SUSPICIOUS_TLDS.includes(hostname.split(".").pop())
  };
}

function reputationBucket(hostname) {
  if (/bank|pay|finance|secure/i.test(hostname)) return "BANKING";
  if (/google|apple|amazon|microsoft|meta|facebook/i.test(hostname)) return "SOCIAL";
  if (/\.(gov|nic|edu)$/i.test(hostname)) return "GOVT";
  return "UNKNOWN";
}

/* ---------------- RULE ENGINE ---------------- */

function ruleRisk(signals) {
  let score = 0;
  const triggers = [];

  if (signals.formActionMismatch) { score += 0.4; triggers.push("FORM_ACTION_MISMATCH"); }
  if (signals.hasIPAddress) { score += 0.4; triggers.push("IP_BASED_URL"); }
  if (signals.hasSuspiciousKeyword) { score += 0.2; triggers.push("SUSPICIOUS_KEYWORD"); }
  if (signals.subdomainDepth >= 3) { score += 0.2; triggers.push("DEEP_SUBDOMAIN"); }
  if (!signals.https) { score += 0.4; triggers.push("NO_HTTPS"); }
  if (signals.hiddenIframePresent) { score += 0.3; triggers.push("HIDDEN_IFRAME"); }
  if (signals.redirectDetected) { score += 0.2; triggers.push("REDIRECT_DETECTED"); }

  return { ruleScore: Math.min(score, 1), triggers };
}

/* ---------------- ML CLASSIFIER ---------------- */

function mlScore(signals, domainMeta) {
  const x = [
    signals.formActionMismatch ? 1 : 0,
    signals.hasIPAddress ? 1 : 0,
    signals.hasSuspiciousKeyword ? 1 : 0,
    signals.subdomainDepth >= 3 ? 1 : 0,
    !signals.https ? 1 : 0,
    domainMeta.hyphenCount > 1 ? 1 : 0,
    domainMeta.numericRatio > 0.2 ? 1 : 0,
    domainMeta.suspiciousTLD ? 1 : 0
  ];

  const w = [-2.0, 1.4, 1.2, 0.6, 0.5, 1.0, 0.8, 1.1];

  let z = w[0];
  for (let i = 0; i < x.length; i++) z += x[i] * w[i + 1];

  return sigmoid(z);
}

/* ---------------- MESSAGE HANDLER ---------------- */

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type !== "RISK_EVALUATION_REQUEST") return;

  const tabId = sender.tab?.id;
  if (!tabId || alertedTabs.has(tabId)) return;

  const hostname = new URL(msg.payload.url).hostname;
  const last = domainCooldowns[hostname];
  if (last && Date.now() - last < DOMAIN_COOLDOWN_MIN * 60000) return;

  const domainMeta = domainHeuristics(hostname);
  const reputation = reputationBucket(hostname);

  const rule = ruleRisk(msg.payload.signals);
  const ml = mlScore(msg.payload.signals, domainMeta);

  const finalScore = 0.6 * rule.ruleScore + 0.4 * ml;
  if (finalScore < 0.3) return;

  const alert = {
    level: finalScore >= 0.6 ? "HIGH" : "MEDIUM",
    riskScore: finalScore,
    intent: msg.payload.intent,
    url: msg.payload.url,
    pageTitle: msg.payload.pageTitle,
    reputation,
    explanations: rule.triggers.map(t => ({
      message: t.replaceAll("_", " ").toLowerCase()
    })),
    timestamp: Date.now()
  };

  alertedTabs.add(tabId);
  domainCooldowns[hostname] = Date.now();

  chrome.storage.local.get({ alerts: [] }, data => {
    chrome.storage.local.set({
      alerts: [alert, ...data.alerts].slice(0, 20)
    });
  });

  chrome.tabs.sendMessage(tabId, {
    type: "PHISHGUARD_ALERT",
    payload: alert
  });
});
