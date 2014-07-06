var fs = require('fs'),
	length = fs.fstatSync(process.stdin.fd).size,
	buffer = new Buffer(length),
	bytesRead = fs.readSync(process.stdin.fd, buffer, 0, length, 0),
	input = buffer.toString('utf8', 0, bytesRead).split('\n');

// var input = require('fs').fstatSync(process.stdin.fc);
// var lines = input.split('\n');exit

function main() {
	console.log('READY');

//	var firstLine = input.get(0);
//	var T = firstLine.get(0), P = firstLine.get(1), H = firstLine.get(2);
	var turn = 0;
	console.log(input);

	while(turn < 10) {
//		for(var i = 0; i < H+2; i++) {
//			var line = lines.shift();
//		}

		if(turn % 2 == 0) {
//			var line = lines.shift();
			dateweekDay();
		} else {
			dateHoliday();
		}
		turn++;
	}
}

function dateWeekday() {
	console.log('0 1 0 1 0');
}

function dateHoliday() {
	console.log('1 0');
}