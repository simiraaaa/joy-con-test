const {
  contextBridge,
  ipcRenderer
} = require("electron");

const fs = require('fs');
const HANOI_DATA_PATH = __dirname + '/data/hanoi.json';
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["packet", "disconnect"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender` 
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  saveHanoi: (json) => {
    json = JSON.stringify(json);
    return new Promise((resolve, reject) => {
      fs.writeFile(HANOI_DATA_PATH, json, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    });
  },
  loadHanoi: () => {
    return JSON.parse(fs.readFileSync(HANOI_DATA_PATH).toString());
  },
});