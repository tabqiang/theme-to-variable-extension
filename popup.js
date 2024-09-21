document.addEventListener("DOMContentLoaded", () => {
  // 从 Chrome 存储中读取信息
  chrome.storage.local.get("colorCollected", (data) => {
    if (data.colorCollected) {
      const statusElement = document.getElementById("collectStatus");
      statusElement.textContent = "Success";
      statusElement.classList.add("success");
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
  const statusElement = document.getElementById("collectStatus");
  statusElement.textContent = "Waiting...";
  statusElement.classList.remove("success");
  statusElement.classList.add("pending");

  // 保存信息到 Chrome 存储
  chrome.storage.local.set({ colorCollected: true }, () => {
    console.log("Color Collected");
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("tabs", tabs);
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: "COLLECT_COLOR",
      },
      () => {
        statusElement.textContent = "Success";
        statusElement.classList.remove("pending");
        statusElement.classList.add("success");
      }
    );
  });
});
