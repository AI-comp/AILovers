console.log('Tokimeki Memorial');

$(function () {
    var wsTestBtn = $('#wsTest');
    var host = window.document.location.host.replace(/:.*/, '');
    var ws = new WebSocket('ws://' + host + ':8000');

    wsTestBtn.click(function () {
        ws.send(JSON.stringify({
            commands: [
                $('#ai1').val(),
                $('#ai2').val(),
                $('#ai3').val(),
                $('#ai4').val(),
            ]
        }));
    });

    ws.onmessage = function (event) {
        log(event.data.replace(/\n/g, '<br />'));
    };

    function log(message) {
        $('#log').append(message);
    }
});