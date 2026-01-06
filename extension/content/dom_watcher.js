(function () {
  if (window.__PHISHGUARD_DOM__) return;
  window.__PHISHGUARD_DOM__ = true;

  const OTP_HINTS = ["otp", "code", "verify", "one-time"];
  const PAYMENT_HINTS = ["card", "cvv", "cvc", "upi", "iban"];

  function attrText(el) {
    return `${el.id || ""} ${el.name || ""} ${el.placeholder || ""}`.toLowerCase();
  }

  function detectIntent(el) {
    if (!el || el.tagName !== "INPUT") return null;
    const text = attrText(el);

    if (el.type === "password") return "CREDENTIAL_ENTRY";

    if (
      el.autocomplete === "one-time-code" ||
      el.type === "tel" ||
      el.type === "number" ||
      (el.maxLength >= 4 &&
        el.maxLength <= 8 &&
        OTP_HINTS.some(h => text.includes(h)))
    ) return "OTP_SUBMISSION";

    if (PAYMENT_HINTS.some(h => text.includes(h))) return "PAYMENT_ENTRY";

    if (el.type === "file") return "DOCUMENT_UPLOAD";

    return null;
  }

  function hasHiddenIframe() {
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      const rect = iframe.getBoundingClientRect();
      const style = window.getComputedStyle(iframe);
      if (
        rect.width <= 2 ||
        rect.height <= 2 ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0"
      ) return true;
    }
    return false;
  }

  function extractSignals(el) {
    const url = new URL(window.location.href);
    let redirectDetected = false;

    try {
      if (document.referrer) {
        redirectDetected =
          new URL(document.referrer).hostname !== url.hostname;
      }
    } catch {}

    let formActionMismatch = false;
    const form = el.closest("form");
    if (form?.action) {
      try {
        const actionURL = new URL(form.action, window.location.href);
        formActionMismatch = actionURL.hostname !== url.hostname;
      } catch {}
    }

    return {
      https: url.protocol === "https:",
      hasIPAddress: /^[0-9.]+$/.test(url.hostname),
      subdomainDepth: url.hostname.split(".").length - 2,
      hasSuspiciousKeyword: /login|verify|secure|account/i.test(url.href),
      iframePresent: !!document.querySelector("iframe"),
      hiddenIframePresent: hasHiddenIframe(),
      redirectDetected,
      formActionMismatch
    };
  }

  document.addEventListener("focusin", event => {
    const el = event.target;
    const intent = detectIntent(el);
    if (!intent) return;

    chrome.runtime.sendMessage({
      type: "RISK_EVALUATION_REQUEST",
      payload: {
        intent,
        url: window.location.href,
        signals: extractSignals(el),
        pageTitle: document.title,
        timestamp: Date.now()
      }
    });
  }, true);
})();
