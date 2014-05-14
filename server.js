var app = require('http').createServer(handler),
    io = require('socket.io').listen(app), //require('socket.io').listen(80);
    fs = require('fs');

app.listen(99);

function handler(req, res) {
    console.log('handler')
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}



io.sockets.on('connection', function(socket) {
    console.log('handle connection');

    var timeoutId = -1;

    /**
     * Handle "disconnect" events.
     */
    var handleDisconnect = function() {
        console.log('handle disconnect');

        clearTimeout(timeoutId);
    };

    /**
     * Handle client requests.
     * @param  {object} data Request arguments
     */
    var handleClientRequest = function(data) {
        console.log('handle client request');
        console.log(data);

        // Apply a random response time to simulate "work"
        setTimeout(generateClientResponse, 1000 * (0.5 * Math.random() + 0.5));
    };

    /**
     * Generate a response to be sent to the client.
     */
    var generateClientResponse = function() {
        console.log('generate client response');

        // Generate a client response after an arbitrary delay
        socket.emit('client response', {
            message: 'this is a client response'
        });
    };

    /**
     * Generate a request to be sent to the client.
     */
    var generateServerRequest = function() {
        console.log('generate server request');

        socket.emit('server request', {
            message: 'this is a server request'
        });

        timeoutId = setTimeout(generateServerRequest, 5000);
    };

    socket.on('client request', handleClientRequest);
    socket.on('disconnect', handleDisconnect);

    timeoutId = setTimeout(generateServerRequest, 5000);
});