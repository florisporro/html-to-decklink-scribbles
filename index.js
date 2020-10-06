const { app, BrowserWindow } = require("electron");
const { Atem } = require("atem-connection");
const myAtem = new Atem({ externalLog: console.log });

const _ = require("lodash");

const fs = require("fs");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("force-device-scale-factor", "1");

let win;

const uploadToAtem = (image) => {
	fs.writeFileSync("./image.png", image.toPNG());
	fs.writeFileSync("./image.bmp", image.toBitmap());
	myAtem.connect("192.168.1.99");
	myAtem.on("connected", () => {
		myAtem.uploadStill(0, image.toBitmap());
	});
};

const debouncedUploadToAtem = _.debounce(uploadToAtem, 1000);

const width = 1920;
const height = 1080;

app.once("ready", () => {
	win = new BrowserWindow({
		show: false,
		frame: false,
		width,
		height,
		webPreferences: {
			offscreen: true,
			transparent: true,
		},
	});

	win.hide();

	win.loadURL("http://localhost:3000/render");

	let i = 0;

	win.webContents.on("paint", (event, dirty, image) => {
		// console.log(image.getBitmap());
		i++;
		console.log("frame " + i);
		debouncedUploadToAtem(image);
	});
});
