var Runner = require('./runner').Runner;

module.exports = function (ws) {

    /*var id = setInterval(function() {
        ws.send(JSON.stringify(process.memoryUsage()), function() { });
    }, 1000);
    console.log('started client interval');*/

    ws.onmessage = function(event) {
        var runner = new Runner();
        runner.runGame(function() {
            ws.send(runner.gameResult, function() { /* No error handling yet */ });
        });
    }

    ws.on('close', function() {
        console.log('Closing WS connection');
    });

};