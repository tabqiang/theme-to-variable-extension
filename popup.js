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
