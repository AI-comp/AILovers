console.log('Tokimeki Memorial');

$(function() {
    var wsTestBtn = $('#wsTest');

    wsTestBtn.click(function() {
        var host = window.document.location.host.replace(/:.*/, '');
        var ws = new WebSocket('ws://' + host + ':8000');

        ws.onmessage = function (event) {
            log(event.data.replace(/\n/g, '<br />'));
            //console.log(JSON.parse(event.data));
        };
    });

    function log(message) {
        $('#log').append(message);
    }
});