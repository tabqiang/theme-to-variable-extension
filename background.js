chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

//接收来自content.js的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received", message);
  if (message.type === "GET_CUSTOM_CSS") {
    console.log("Custom CSS properties", message.customProperties);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "showPopup",
        customProperties: message.customProperties,
      });
    });
  }
});
