import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import { IpcMain } from 'electron';
import axios from 'axios';





// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		autoHideMenuBar: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			webviewTag: true,
		},
		fullscreen: false
	});

	
	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	

	win.webContents.session.on('will-download', (event, item, webContents) => {

		console.log("Save Path  ", item.getSavePath())
		console.log("File Name  ", item.getFilename())
		console.log("Something is downloaded yooooo")

		item.once('done', (event, state) => {

			if(state === 'completed'){
				console.log(item.getSavePath())
				console.log(item.getFilename())

				let obj = {
					fileName : item.getFilename(),
					url : item.getURL(),
					location : item.getSavePath(),
					date : item.getLastModifiedTime()
				}

				axios.post("http://localhost:7000/download", obj)
			}
		})

	})

	


	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, 'index.html'));
	}


	//win.webContents.openDevTools();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
	}
});

ipcMain.on('my-close-app', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
	}
});

ipcMain.on('open-download', () => {
	createDownloadPage()
})

ipcMain.on('scrollEvent', (event, args) => {
	let x : number | undefined = win?.webContents.zoomLevel  
	let delta = args.delta
	x += delta
	win?.webContents.setZoomLevel(x)
})


ipcMain.on('search-text', (event, arg) => {

	console.log(typeof arg)

	if(arg && arg.length !== 0){
		win?.webContents.findInPage(arg)
		win?.webContents.send('focusText')
	}
})



app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);


function createDownloadPage(){
	
	const {width , height } = screen.getPrimaryDisplay().workAreaSize

	let winDownload = new BrowserWindow({
		width : width,
		height : height,
		fullscreen : true
	})

	if (VITE_DEV_SERVER_URL) {

		let url = VITE_DEV_SERVER_URL + "DownloadPage"

		console.log(url)
		winDownload.loadURL(url);
	}

}
