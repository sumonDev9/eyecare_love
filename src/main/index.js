import { app, shell, BrowserWindow, ipcMain, Tray, Menu, powerMonitor } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // 🔴 অ্যাপ স্টার্ট হলে উইন্ডো হাইড থাকবে
    autoHideMenuBar: true,
    fullscreen: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // উইন্ডো ক্লোজ (X) বাটনে ক্লিক করলে অ্যাপটি বন্ধ না হয়ে ব্যাকগ্রাউন্ডে চলে যাবে
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray() {
  // System Tray আইকন সেটআপ
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Settings', click: () => mainWindow.show() },
    { 
      label: 'Pause Reminder', 
      type: 'checkbox', 
      checked: false, 
      click: (menuItem) => {
        mainWindow.webContents.send('toggle-pause', menuItem.checked)
      }
    },
    { type: 'separator' },
    { 
      label: 'Exit', 
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ])
  tray.setToolTip('EyeCare Love ❤️\nBecause every blink matters.')
  tray.setContextMenu(contextMenu)
  
  // Tray আইকনে ক্লিক করলেও উইন্ডো ওপেন হবে
  tray.on('click', () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 🔴 Windows Startup-এ অটোমেটিক রান করার কোড
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe')
  })

  createWindow()
  createTray()

  // 🔴 Smart Activity Detection (Mouse/Keyboard কাজ না করলে)
  setInterval(() => {
    // ইউজারের কতক্ষণ ধরে কোনো অ্যাক্টিভিটি নেই তা চেক করবে
    const idleTime = powerMonitor.getSystemIdleTime()
    // যদি 60 সেকেন্ড (১ মিনিট) কোনো কাজ না করে, তবে React-কে 'idle' মেসেজ পাঠাবে
    if (idleTime > 60) {
      mainWindow.webContents.send('system-idle', true)
    } else {
      mainWindow.webContents.send('system-idle', false)
    }
  }, 5000) // প্রতি ৫ সেকেন্ড পরপর চেক করবে
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 🔴 React থেকে সিগন্যাল পেলে Full Screen Rest Mode চালু করবে
ipcMain.on('start-rest', () => {
  mainWindow.setFullScreen(true);
  mainWindow.show();
  mainWindow.setAlwaysOnTop(true, 'screen-saver'); // সবকিছুর উপরে থাকবে
})

// Rest Mode শেষ হলে আবার আগের অবস্থায় ফিরে যাবে
ipcMain.on('end-rest', () => {
  mainWindow.setFullScreen(false);
  mainWindow.hide();
  mainWindow.setAlwaysOnTop(false);
})