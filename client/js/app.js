console.log('Tokimeki Memorial');

$(function() {
    var wsTestBtn = $('#wsTest');
    var host = window.document.location.host.replace(/:.*/, '');
    var ws = new WebSocket('ws://' + host + ':8000');

    wsTestBtn.click(function() {
        ws.send(JSON.stringify({
            commands: ['program1', 'program2', 'program3']
        }));
    });

    ws.onmessage = function (event) {
        log(event.data.replace(/\n/g, '<br />'));
    };

    function log(message) {
        $('#log').append(message);
    }
});