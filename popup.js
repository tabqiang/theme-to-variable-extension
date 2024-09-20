document.addEventListener("DOMContentLoaded", () => {
  // 从 Chrome 存储中读取信息
  chrome.storage.local.get("color", (data) => {
    if (data.color) {
      document.getElementById("color").innerHTML = data.color;
    }
  });
});

document.getElementById("pickColorButton").addEventListener("click", () => {
  if (!window.EyeDropper) {
    alert("Your browser does not support the EyeDropper API.");
    return;
  }

  const eyeDropper = new EyeDropper();
  eyeDropper
    .open()
    .then((result) => {
      const color = result.sRGBHex;
      console.log("Selected color:", color);
      //发送消息给content.js
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("tabs", tabs);
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "GET_COLOR",
          color: color,
        });
      });
    })
    .catch((e) => {
      console.error(e);
    });
});

//collectColor
document.getElementById("collectColor").addEventListener("click", () => {
  //id时color的div设置成Y
  document.getElementById("color").innerHTML = "Y";

  // 保存信息到 Chrome 存储
  chrome.storage.local.set({ color: "Y" }, () => {
    console.log("Color saved");
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("tabs", tabs);
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "COLLECT_COLOR",
    });
  });
});
