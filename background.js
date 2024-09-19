chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  console.log(chrome.action);
});
chrome.action.onClicked.addListener((tab) => {
  console.log("扩展程序图标被点击");
  // 发送消息给内容脚本
  chrome.tabs.sendMessage(tab.id, { action: "showPopup" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log("消息发送成功", response);
    }
  });
});

//接收来自content.js的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received", message);
  if (message.type === "GET_CUSTOM_CSS") {
    console.log("Custom CSS properties", message.customProperties);
    //储存到本地
    chrome.storage.local.set({ customProperties: message.customProperties });
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.tabs.sendMessage(tabs[0].id, {
    //     type: "showPopup",
    //     customProperties: message.customProperties,
    //   });
    // });
  }
});

chrome.action.onClicked.addListener((tab) => {
  console.log("Action clicked");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: pickColor,
  });
});

function pickColor() {
  console.log("pickColor");
  if (!window.EyeDropper) {
    alert("Your browser does not support the EyeDropper API.");
    return;
  }

  const eyeDropper = new EyeDropper();
  eyeDropper
    .open()
    .then((result) => {
      alert(`Selected color: ${result.sRGBHex}`);
    })
    .catch((e) => {
      console.error(e);
    });
}
