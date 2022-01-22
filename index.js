const JoyCon = require('ns-joycon');

const {
  app,
  BrowserWindow,
  ipcMain,
} = require('electron');

const setupJoyCon = () => {
  JoyCon.findControllers((devices) => {
    // When found any device.
    devices.forEach(async (device) => {
      console.log(`Found a device (${device.meta.serialNumber})`);
      // Add a handler for new device.
      device.manageHandler('add', (packet) => {
        // console.log(device.meta.product, packet.actualAccelerometer);
        // electron に送信
        if (mainWindow) {
          mainWindow.webContents.send('packet', packet.actualAccelerometer);
        }
      });
      device.hid.on('error', () => {
        if (mainWindow) {
          mainWindow.webContents.send('disconnect');
        }
      });
      await device.enableIMU();
    });
  });
}

// global.toggleDevTools = () => {
//   ipcRenderer.sendToHost('call', 'toggleDevTools');
// };
let mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  mainWindow = new BrowserWindow({
    webPreferences: {
      // webSecurity: false,
      // allowRunningInsecureContent: true,
      // webview タグを使うには必要
      webviewTag: true,
      // nativeWindowOpen: true,

      preload: `${__dirname}/preload.js`,
    },
    width: 800,
    height: 800,
    // ウィンドウ透過
    // transparent: true,
    // 影なし
    // hasShadow: false,

    // frame: false,
  });
  mainWindow.loadURL(`file://${__dirname}/hanoiframe.html?{}`);
  
  setupJoyCon();

  ipcMain.on('toMain', (event, data) => {
    if (data.type === 'connect') {
      setupJoyCon();
    }
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
    app.quit();
  });
});