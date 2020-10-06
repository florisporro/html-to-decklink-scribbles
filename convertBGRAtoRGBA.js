module.exports = function(width, height, data) {
	const buffer = Buffer.alloc(width * height * 4);
	let i = 0;
	while (i < width * height * 4) {
		const b1 = data[i + 0];
		const g1 = data[i + 1];
		const r1 = data[i + 2];
		const a1 = data[i + 3];

		buffer[i + 0] = r1;
		buffer[i + 1] = g1;
		buffer[i + 2] = b1;
		buffer[i + 3] = a1;
		i = i + 4;
	}
	return buffer;
};
