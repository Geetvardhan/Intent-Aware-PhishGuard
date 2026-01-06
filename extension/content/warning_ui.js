(function () {
  if (window.__PHISHGUARD_UI__) return;
  window.__PHISHGUARD_UI__ = true;

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type !== "PHISHGUARD_ALERT") return;

    const overlay = document.createElement("div");
    overlay.style = `
      position:fixed;inset:0;background:rgba(0,0,0,.55);
      display:flex;align-items:center;justify-content:center;
      z-index:2147483647;
    `;

    overlay.innerHTML = `
      <div style="background:#fff;width:420px;padding:20px;border-radius:12px">
        <h3>${msg.payload.level === "HIGH" ? "High Risk Detected" : "Potential Risk"}</h3>
        <ul>${msg.payload.explanations.map(e => `<li>${e.message}</li>`).join("")}</ul>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button id="pg-back">Go Back</button>
          <button id="pg-proceed">Proceed</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById("pg-back").onclick = () => history.back();
    document.getElementById("pg-proceed").onclick = () => overlay.remove();
  });
})();
