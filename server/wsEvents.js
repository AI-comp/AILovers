var Runner = require('./runner').Runner;

module.exports = function (ws) {

    /*var id = setInterval(function() {
        ws.send(JSON.stringify(process.memoryUsage()), function() { });
    }, 1000);
    console.log('started client interval');*/

    var runner = new Runner();
    runner.runGame();

    ws.on('close', function() {
        console.log('Closing WS connection');
    });

};