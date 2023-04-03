let imageUrl = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "annotateImage",
    title: "NFT trait generator",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("annotateImage listener")
  if (info.menuItemId === "annotateImage") {
    imageUrl = info.srcUrl;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("getImageUrl listener")
  if (request.type === "getImageUrl") {
    sendResponse({ imageUrl: imageUrl });
  }
});
