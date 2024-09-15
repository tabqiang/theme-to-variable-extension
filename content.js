console.log("Hello from content.js");
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

//定义事件类型，调用getCustomCss，发送给background.js
chrome.runtime.sendMessage({
  type: "GET_CUSTOM_CSS",
  customProperties: getCustomCss(),
});

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

let popupInstance = null;
function showPopup(properties) {
  if (!popupInstance) {
    popupInstance = document.createElement("div");
    popupInstance.style.position = "fixed";
    popupInstance.style.top = "20%";
    popupInstance.style.left = "10%";
    popupInstance.style.width = "80%";
    popupInstance.style.height = "500px";
    popupInstance.style.backgroundColor = "white";
    popupInstance.style.zIndex = "9999";
    popupInstance.style.display = "flex";
    popupInstance.style.justifyContent = "center";
    popupInstance.style.alignItems = "center";
    popupInstance.style.flexDirection = "column";
    popupInstance.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    popupInstance.style.borderRadius = "8px";
    popupInstance.style.padding = "20px";
    popupInstance.style.overflowY = "auto";

    // 创建关闭按钮
    const closeButton = document.createElement("button");
    closeButton.textContent = "关闭";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.backgroundColor = "#f44336";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "10px";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
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
    <h1 style="font-size:40px;font-weight:bold">Custom CSS Properties</h1>
    <ul>
      ${properties
        .map(([property, value]) => `<li>${property}: ${value}</li>`)
        .join("")}
    </ul>
  `;
}
