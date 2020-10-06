const { app, BrowserWindow } = require("electron");
const { Atem } = require("atem-connection");
const myAtem = new Atem({ externalLog: console.log });

const _ = require("lodash");

const fs = require("fs");

const convertBGRAToYUV422 = require("./convertBGRAToYUV422");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("force-device-scale-factor", "1");

let win;

const width = 1920;
const height = 1080;

async function* renderStream() {
	const win = new BrowserWindow({
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

	await new Promise((resolve) => {
		win.webContents.once("did-finish-load", resolve);
	});
	win.webContents.frameRate = 60;

	while (!this.interrupt) {
		const frame = new Promise((resolve) => {
			win.webContents.once("paint", (event, dirty, image) => {
				resolve(image);
			});
		});
		yield await frame;
	}
}

async function handleFrame(nativeImage) {
	let getBitmap = nativeImage.toBitmap();
	// const yuv = convertBGRAToYUV422(1920, 1080, getBitmap);
	return "handled";
}

app.once("ready", async () => {
	let i = 0;
	let emitChange = 0;

	let startTime = new Date();

	for await (const nativeImage of renderStream()) {
		i++;
		emitChange++;

		await handleFrame(nativeImage);

		if (emitChange === 100) {
			let totalTime = new Date() - startTime;
			totalTime /= 1000;
			const period = totalTime / 100;
			const fps = 1 / period;
			console.log(`Frame ${i} - ${Math.round(fps)}hz`);
			startTime = new Date();
			emitChange = 0;
		}
	}
});
