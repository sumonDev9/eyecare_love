import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom API for React
const api = {
  // Main Process থেকে ডাটা রিসিভ করার জন্য
  onSystemIdle: (callback) => ipcRenderer.on('system-idle', (_event, isIdle) => callback(isIdle)),
  onTogglePause: (callback) => ipcRenderer.on('toggle-pause', (_event, isPaused) => callback(isPaused)),
  
  // Main Process-এ কমান্ড পাঠানোর জন্য
  startRestMode: () => ipcRenderer.send('start-rest'),
  endRestMode: () => ipcRenderer.send('end-rest')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api) // 'api' নামে React-এ ব্যবহার করতে পারব
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}