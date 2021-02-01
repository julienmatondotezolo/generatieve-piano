const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userObj) => {
        console.log(`${userObj.username} joined ROOM: ${roomId}.`);
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userObj)

        socket.on('message', (data) => {
            console.log(`${userObj} send: `, data)
            socket.to(roomId).broadcast.emit('message', data);
        });

        socket.on('piano-key', (data) => {
            socket.to(roomId).broadcast.emit('piano-key', data);
        });

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userObj)
        })
    })
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));


/*/////////////   CLASSIC WEBSOCKETS   ////////////////*/

// let CLIENTS = [];
// const WebSocket = require('ws')
// const wss = new WebSocket.Server({
//     port: '8080'
// })

// wss.on('connection', socket => {
//     socket.on('message', message => {
//         let peerObj = JSON.parse(message)
//         socket.send(`${peerObj.message}`);
//     });
// });