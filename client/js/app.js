console.log('Tokimeki Memorial');

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
    });

    ws.onmessage = function (event) {
        log(event.data.replace(/\n/g, '<br />'));
    };

    function log(message) {
        $('#log').append(message);
    }
});