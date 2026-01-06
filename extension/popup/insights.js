const BRANDS = ["google", "paypal", "amazon", "microsoft", "apple", "meta", "bank"];

chrome.storage.local.get({ alerts: [] }, data => {
  const brandCounts = {};
  const reputationCounts = {};
  const alertsEl = document.getElementById("alerts");

  data.alerts.forEach(a => {
    const text = `${a.url} ${a.pageTitle || ""}`.toLowerCase();
    const brand = BRANDS.find(b => text.includes(b)) || "Unknown";

    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    reputationCounts[a.reputation] = (reputationCounts[a.reputation] || 0) + 1;

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <span class="badge ${a.level}">${a.level}</span>
      <p>${a.intent}</p>
      <small>${new Date(a.timestamp).toLocaleString()}</small>
    `;
    alertsEl.appendChild(div);
  });

  Object.entries(brandCounts).forEach(([b, c]) => {
    const p = document.createElement("p");
    p.textContent = `Brand: ${b} — ${c}`;
    document.getElementById("brands").appendChild(p);
  });

  Object.entries(reputationCounts).forEach(([r, c]) => {
    const p = document.createElement("p");
    p.textContent = `Reputation: ${r} — ${c}`;
    document.getElementById("reputation").appendChild(p);
  });
});
