(function () {
  console.log("[PhishGuard] DOM watcher injected");

  // Delay message slightly to ensure service worker wakes up
  setTimeout(() => {
    chrome.runtime.sendMessage({
      type: "PAGE_LOADED",
      payload: {
        url: window.location.href,
        timestamp: Date.now()
      }
    });
  }, 500);
})();
