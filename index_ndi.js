const { app, BrowserWindow } = require("electron");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("force-device-scale-factor", "1");

let win;

const width = 1920;
const height = 1080;

const grandiose = require("grandiose");

grandiose.send();

app.once("ready", () => {
	win = new BrowserWindow({
		show: false,
		frame: false,
		width,
		height,
		webPreferences: {
			offscreen: true,
			transparent: true
		}
	});

	win.hide();

	win.loadURL("http://localhost:4000/render");

	let i = 0;

	win.webContents.on("paint", (event, dirty, image) => {
		// console.log(image.getBitmap());
		i++;
		console.log("frame " + i);
		debouncedUploadToAtem(image);
	});
});
