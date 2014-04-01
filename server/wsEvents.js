module.exports = function (ws) {

    var id = setInterval(function() {
        ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
    }, 1000);
    console.log('started client interval');

    ws.on('close', function() {
        console.log('stopping client interval');
        clearInterval(id);
    });

};