let imageUrl = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "annotateImage",
    title: "Annotate Image",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("annotateImage listener")
  if (info.menuItemId === "annotateImage") {
    console.log('Yo! enrique debuger');
    console.log(info);
    imageUrl = info.srcUrl;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("getImageUrl listener")
  if (request.type === "getImageUrl") {
    sendResponse({ imageUrl: imageUrl });
  }
});
