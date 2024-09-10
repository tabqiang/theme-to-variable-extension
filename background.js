chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

//接收来自content.js的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message from content script");
  console.log(message);
  console.log(sender);
  console.log("Received message from content script");
  let customProperties = getCustomCss();
  console.log(customProperties);
  sendResponse(customProperties);
});
