console.log("[PhishGuard] Service worker initialized");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PAGE_LOADED") {
    console.log(
      "[PhishGuard] Page loaded:",
      message.payload.url
    );
  }
});
