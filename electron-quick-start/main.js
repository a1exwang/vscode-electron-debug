const electron = require('electron')
const { app, BrowserWindow, BrowserView } = electron;
app.commandLine.appendSwitch ("disable-http-cache");

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 1000,
    webPreferences: {
      webviewTag: true,
      allowVideoRendererInSandbox: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  mainWindow.webContents.on('will-attach-webview', (e, webPreferences, ps) => {
    // webPreferences.preload = utils.getPreloadPath('src/renderer/video-extensibility/videoapp/preload.js', true);
    webPreferences.contextIsolation = true;
    webPreferences.allowVideoRendererInSandbox = true;
    webPreferences.allowVideoExtensibilityInSandbox = true;
    webPreferences.sandbox = true;
    webPreferences.worldSafeExecuteJavaScript = true;
    webPreferences.additionalArguments = ['--enable-precise-memory-info'];
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // const window1 = new BrowserWindow({
  //   title: "Browser Window 1",
  //   width: 400,
  //   height: 300,
  // });
  // window1.loadURL("http://localhost:8080/index.html");

  // For some reason, creating BrowserView has some timing issue. Use a timeout to workaround.
  setTimeout(createBrowserView, 500);
}

function createBrowserView() {
  const view = new BrowserView();
  mainWindow.setBrowserView(view);
  view.setBounds({ x: 0, y: 550, width: 300, height: 300 });
  view.setBackgroundColor("#ecc");
  view.webContents.loadURL("http://localhost:8080/index.html");
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
