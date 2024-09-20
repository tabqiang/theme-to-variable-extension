console.log("Hello from content.js");

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showPopup") {
    console.log("Received message to show popup");
    const customProperties = getCustomCss();
    showPopup(customProperties);
    sendResponse({ status: "Popup shown" });
  }
});
//点击时触发
// chrome.action.onClicked.addListener((tab) => {
//   console.log(tab);
//   console.log("onclick ");
//   console.log("onclick ");
// });

//定义一个函数，收集页面自定义的css属性
function getCustomCss() {
  let customProperties = {};
  for (let sheet of document.styleSheets) {
    for (let rule of sheet.cssRules) {
      if (rule instanceof CSSStyleRule) {
        for (let declaration of rule.style) {
          if (declaration.startsWith("--")) {
            customProperties[declaration] =
              rule.style.getPropertyValue(declaration);
          }
        }
      }
    }
  }
  return customProperties;
}

//receive collectColor message from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "COLLECT_COLOR") {
    console.log("collect color");
    const customProperties = getCustomCss();
    console.log(customProperties);
    chrome.storage.local.set({ customProperties });
  }
});

//定义事件类型，调用getCustomCss，发送给background.js
// chrome.runtime.sendMessage({
//   type: "GET_CUSTOM_CSS",
//   customProperties: getCustomCss(),
// });

//接收来自popup.js的消息，找customProperties属性中的值，探讨显示和message中的颜色一样的属性
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_COLOR") {
    console.log("collect color", message.color);
    const color = message.color;
    //获取customProperties
    chrome.storage.local.get("customProperties", (data) => {
      let customProperties = data.customProperties;
      //找到和message中的颜色一样的属性的数组，
      let properties = Object.entries(customProperties).filter(
        ([property, value]) => value === color
      );
      console.log(properties);
      //调用函数
      showPopup(properties);
    });
  }
});

// function insertCSS() {
//   const link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.type = "text/css";
//   link.href = chrome.runtime.getURL("theme-to-variable.css");
//   document.head.appendChild(link);
// }
// insertCSS();

let popupInstance = null;
function showPopup(properties) {
  if (!popupInstance) {
    popupInstance = document.createElement("div");
    popupInstance.className = "theme-context-box theme-to-variable popup";

    // 创建关闭按钮
    const closeButton = document.createElement("button");
    closeButton.textContent = "关闭";
    closeButton.className = "theme-to-variable close-button";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(popupInstance);
      popupInstance = null;
    });

    popupInstance.appendChild(closeButton);
    document.body.appendChild(popupInstance);

    // 点击弹窗之外的区域时关闭弹窗
    document.addEventListener("click", (event) => {
      if (popupInstance && !popupInstance.contains(event.target)) {
        document.body.removeChild(popupInstance);
        popupInstance = null;
      }
    });
  }

  popupInstance.innerHTML = `
    <h1  class="title">Custom CSS Properties</h1>
    <ul>
      ${properties
        .map(
          ([property, value]) =>
            `<li class ="css-item">${property}: ${value}</li>`
        )
        .join("")}
    </ul>
  `;
}
