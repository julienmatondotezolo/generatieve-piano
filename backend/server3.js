const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (data) =>     {
        console.log(data);
        io.emit('data', `${socket.id.substr(0,2)} said ${data}` );   
    });
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );


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