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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "showPopup") {
    console.log("Show popup", message.customProperties);
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "20";
    popup.style.left = "0";
    popup.style.width = "80%";
    popup.style.height = "500px";
    popup.style.backgroundColor = "white";
    popup.style.zIndex = "9999";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.flexDirection = "column";
    popup.innerHTML = `
      <h1>Custom CSS Properties</h1>
      <ul>
        ${Object.entries(message.customProperties)
          .map(([property, value]) => `<li>${property}: ${value}</li>`)
          .join("")}
      </ul>
    `;
    document.body.appendChild(popup);
  }
});
