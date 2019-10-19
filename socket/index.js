const jwt = require('jsonwebtoken');
function getCookie(cname, stringCookie) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(stringCookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

module.exports = (http) => {
    var io = require('socket.io')(http);
    io.use((socket, next) => {
        let token = getCookie('refresh_token',socket.handshake.headers.cookie);
        if (!token) {
            return next(new Error('Authentication error'));
        } else {
            try {
                var decoded = jwt.verify(token, process.env.TOKEN_CLIENT_PRIVATE);
                socket.user = decoded;
            } catch (error) {
                return next(new Error('Authentication error'));
            }
        }
        return next();
    })

    io.on('connection', function(socket) {
        socket.join(socket.user._id);

        socket.on('joinRoom', function(roomName) {
            socket.join(roomName);
        });

        socket.on('leaveRoom', function(roomName) {
            socket.leave(roomName);
        })

        console.log('A user connected');
        console.log(socket.user);
    });
    return io;
}