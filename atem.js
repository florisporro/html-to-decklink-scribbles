const { Atem } = require("atem-connection");
const myAtem = new Atem({ externalLog: console.log });

const fs = require("fs");

const convertBGRAToYUV422 = require("./convertBGRAToYUV422");

myAtem.connect("192.168.2.99");

myAtem.on("connected", () => {
	// myAtem.on("stateChanged", function(err, state) {
	// 	console.log(state); // catch the ATEM state.
	// });

	const bitmap = fs.readFileSync("./image.bmp");
	const yuv = convertBGRAToYUV422(1920, 1080, bitmap);

	// myAtem.uploadStill(0, yuv, "Still 4", "Graphics");

	myAtem.dataTransferManager.uploadStill(10, yuv, "Still 6", "Graphics");
});
