const { app, BrowserWindow } = require('electron');
const path = require('path');


function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 1200,
        minWidth: 1024, 
        minHeight: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const devURL = 'http://localhost:5173';
    const prodURL = `file://${path.join(__dirname, 'dist', 'index.html')}`;
    if (process.env.NODE_ENV === 'development'){
        console.log("dev");
    }
    else{
        console.log("pro");
    }


    // 🔄 Esperar a que Vite esté listo antes de cargar
    const url = process.env.NODE_ENV === 'development' ? devURL : prodURL;

    win.loadURL(url);

    // Abre las herramientas de desarrollo (opcional)
    win.webContents.openDevTools();
    win.setMenuBarVisibility(false);
    win.removeMenu();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});