console.log('AI Lovers');

$(function () {
    var wsTestBtn = $('#wsTest');
    var host = window.document.location.host.replace(/:.*/, '');
    var ws = new WebSocket('ws://' + host + ':8000');

    wsTestBtn.click(function () {
        ws.send(JSON.stringify({
            commands: _.map(_.range(4), function (i) {
                return $('#ai' + i).val();
            })
        }));
        $('#log').html('Running a game...');
    });

    ws.onmessage = function (event) {
        var result = JSON.parse(event.data);
        var htmlLog = _.map(result.log, function (log) {
            return log.message.replace(/\n/g, '<br />');
        }, this).join('<br />');
        showLog(htmlLog);
    };

    function showLog(message) {
        $('#log').html(message);
    }
});