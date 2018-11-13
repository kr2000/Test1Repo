// Modules to control application life and create native browser window
const {app, ipcMain, protocol, BrowserWindow, dialog} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function interceptFileProtocol() {
  // Intercept the file protocol so that references to folders return its index.html file
  // It's because of your all files are being served from the local file system rather 
  // than the relative app path. The solution is to intercept the file protocol
  const fileProtocol = 'file';
  const cwd = process.cwd();
  protocol.interceptFileProtocol(fileProtocol, (request, callback) => {
      const fileUrl = new url.URL(request.url);
      const hostname = decodeURI(fileUrl.hostname);
      const filePath = decodeURI(fileUrl.pathname);
      let resolvedPath = path.normalize(filePath);
      if (resolvedPath[0] === '\\') {
          // Remove URL host to pathname separator
          resolvedPath = resolvedPath.substr(1);
      }

      // the file paths for static\build\*.css and *.js are incorrectly
      // tagged to c: root dir. Fix that here.
      var includes = resolvedPath.toLowerCase().includes(cwd.toLowerCase());
      var hasC = resolvedPath.substr(0, 2).toLowerCase() ? true : false;
      if (!includes && hasC) {
        resolvedPath = resolvedPath.substr(2);
        resolvedPath = cwd + '\\build' + resolvedPath;
      }

      if (hostname) {
          resolvedPath = path.join(hostname, resolvedPath);
          if (process.platform === 'win32') {  // File is on a share
              resolvedPath = `\\\\${resolvedPath}`;
          }
      }
      resolvedPath = path.relative(cwd, resolvedPath);
      try {
          if (fs.statSync(resolvedPath).isDirectory) {
              let index = path.posix.join(resolvedPath, 'index.html');
              if (fs.existsSync(index)) {
                  resolvedPath = index;
              }
          }
      } catch(_) {
          // Use path as is if it can't be accessed
      }
      callback({
          path: resolvedPath,
      });
  });
}

function createWindow () {
  interceptFileProtocol();

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app from build folder.
  let pageUrl;
  if (pageUrl === undefined) {
      pageUrl = url.format({
          pathname: path.join(__dirname, '../build/'),
          protocol: 'file',
      });
  }
  mainWindow.loadURL(pageUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
