var lineCount = 0;
var initialized = false;
var isHoliday = false;
var turn = 0;

var readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt("");
console.log('READY');
rl.prompt();
rl.on('line', function (line) {
	lineCount++;
	if(lineCount == 2 && !initialized) {
		initialized = true;
		lineCount = 0;
	} else if(!isHoliday && lineCount == 11) {
		dateWeekday();
		isHoliday = true;
		lineCount = 0;
		turn++;
	} else if(isHoliday && lineCount == 10) {
		dateHoliday();
		isHoliday = false;
		lineCount = 0;
		turn++;
	}
	if(turn < 10) {
		rl.prompt();
	}
});

function dateWeekday() {
	console.log('0 1 0 1 0');
}

function dateHoliday() {
	console.log('1 0');
}