const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
var starName = '';
var starX = [];
var starY = [];
var innerColor = [];
var starRadius = [];
var starAmount = 0;
/*
Hyper Giant - 40
Super Giant - 35
Giant - 30
Sub Giant - 20
Main Sequence - 15
Dwarf - 5
*/

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

function outerColorGenerator(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var r = parseInt(result[1], 16);
	var g = parseInt(result[2], 16);
	var b = parseInt(result[3], 16);
	var gradientDecide = Math.floor(Math.random() * 2);
	if (gradientDecide == 0) {
		r = Math.floor(r + (255 - r) * 0.5);
		g = Math.floor(g + (255 - g) * 0.5);
		b = Math.floor(b + (255 - b) * 0.5);
	} else {
		r = Math.floor((r * 2) / 3);
		g = Math.floor((g * 2) / 3);
		b = Math.floor((b * 2) / 3);
	}
	return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

async function starGen() {
	const canvas = createCanvas(100, 100);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#000000';
	var starPalette = [
		'445094',
		'8ab1cf',
		'24346c',
		'5965a4',
		'b09bc7',
		'313e58',
		'f53636'
	];
	var outerColor = [];
	var j = 0;
	starRadius[0] = starRadius[0] / Math.log(starAmount + 2);

	for (var y = 0; y < canvas.width; y++) {
		for (var x = 0; x < canvas.height; x++) {
			j = Math.floor(Math.random() * 100);
			if (j < 1) {
				radius = 1;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
				ctx.lineWidth = 1;
				cC = Math.floor(Math.random() * starPalette.length);
				ctx.fillStyle = '#' + starPalette[cC];
				ctx.fill();
			}
		}
	}

	for (var i = 0; i < starAmount; i++) {
		if (i == 0) {
			outerColor[i] = outerColorGenerator(innerColor[i]);
			starRadius[i] = starRadius[i] + Math.floor(Math.random() * 5);
		} else {
			innerColor[i] =
				starPalette[Math.floor(Math.random() * starPalette.length)];
			outerColor[i] = outerColorGenerator(innerColor[i]);
			starRadius[i] =
				starRadius[0] / (Math.floor(Math.random() * starAmount) + 1);
			starX[i] = Math.floor(Math.random() * 100);
			starY[i] = Math.floor(Math.random() * 100);
			if (starRadius[i] > 5) {
				starRadius[i] = starRadius[i] - Math.floor(Math.random() * 5);
			}
		}
	}

	for (var i = 0; i < starAmount; i++) {
		j = Math.floor(Math.random() * outerColor.length);
		var grd = ctx.createRadialGradient(
			starX[j],
			starY[j],
			(starRadius[j] * 9) / 10,
			starX[j],
			starY[j],
			starRadius[j]
		);
		grd.addColorStop(0, '#' + outerColor[j]);
		grd.addColorStop(1, '#' + outerColor[j] + '00');
		grd.addColorStop(2, '#00000000');
		// Fill with gradient
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 100, 100);
		grd = ctx.createRadialGradient(
			starX[j],
			starY[j],
			starRadius[j] / 5,
			starX[j],
			starY[j],
			(starRadius[j] * 9) / 10
		);
		grd.addColorStop(0, '#' + innerColor[j]);
		grd.addColorStop(1, '#' + outerColor[j]);
		grd.addColorStop(2, '#00000000');
		// Fill with gradient
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 100, 100);
		starX.splice(j, 1);
		starY.splice(j, 1);
		innerColor.splice(j, 1);
		outerColor.splice(j, 1);
		starRadius.splice(j, 1);
	}

	var buffer = canvas.toBuffer();
	var filename = './' + starName + '.png';
	fs.writeFileSync(filename, buffer);
}

var starData = fs.readFileSync('./starData.txt').toString();
starData = starData.split('\n');
for (i = 0; i < starData.length; i++) {
	starData[i] = starData[i].split(' ');
	starName = starData[i][0];
	innerColor = [starData[i][1]];
	starRadius = [Math.floor(starData[i][2])];
	starAmount = Math.floor(starData[i][3]);
  starX = [50];
  starY = [50];
	starGen();
}
