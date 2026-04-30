import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('windowAPI', {
    onMaximized: (callback) => {
        const subscription = () => callback();
        ipcRenderer.on('window-maximized', subscription);
        return () => ipcRenderer.removeListener('window-maximized', subscription);
    },
    onUnmaximized: (callback) => {
        const subscription = () => callback();
        ipcRenderer.on('window-unmaximized', subscription)
        return () => ipcRenderer.removeListener('window-unmaximized', subscription);
    },
    maximize: () => ipcRenderer.invoke('window-maximize-request'),
    unmaximize: () => ipcRenderer.invoke('window-unmaximize-request'),
    close: () => ipcRenderer.invoke('window-close-request'),
    minimize: () => ipcRenderer.invoke('window-minimize-request')
})