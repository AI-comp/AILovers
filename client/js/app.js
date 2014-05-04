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
        $('#log').html('');
    });

    ws.onmessage = function (event) {
        var aiForLog = $('input:radio[name=log]:checked').val();
        var result = JSON.parse(event.data);
        var log = result.log[aiForLog] + '\n' + 'Winner: ' + JSON.stringify(result.winner) + '\n';
        showLog(log.replace(/\n/g, '<br />'));
    };

    function showLog(message) {
        $('#log').html(message);
    }
});