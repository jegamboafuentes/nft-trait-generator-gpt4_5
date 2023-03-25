chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "annotateImage",
    title: "Annotate Image",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "annotateImage") {
    chrome.tabs.sendMessage(tab.id, { imageUrl: info.srcUrl });
  }
});
