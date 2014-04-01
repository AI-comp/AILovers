console.log('Tokimeki Memorial');

var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':8000');

ws.onmessage = function (event) {
    //console.log(event);
    //console.log(JSON.parse(event.data));
};