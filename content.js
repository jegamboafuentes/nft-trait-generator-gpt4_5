chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.imageUrl) {
    chrome.runtime.sendMessage({ imageUrl: request.imageUrl });
  }
});
