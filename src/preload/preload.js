import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    status: () => 'Systems Online',
    // We will add your game library IPCs here next
})