console.log("Hello from content.js");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_CUSTOM_CSS") {
    // 在这里处理事件
    console.log("事件已触发");
    let customProperties = getCustomCss();
    console.log(customProperties);
    sendResponse(customProperties);
  }
});

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
