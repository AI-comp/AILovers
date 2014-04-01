console.log('Tokimeki Memorial');

$(function() {
    var wsTestBtn = $('#wsTest');
    var log = $('#log');

    wsTestBtn.click(function() {
        var host = window.document.location.host.replace(/:.*/, '');
        var ws = new WebSocket('ws://' + host + ':8000');

        ws.onmessage = function (event) {
            console.log(event);
            //console.log(JSON.parse(event.data));
        };
    });
});