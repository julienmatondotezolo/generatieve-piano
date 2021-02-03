const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5500/",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 8080;
let canJoin = true;

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('join-room', (roomId, userObj) => {

        if(canJoin) {
            socket.join(roomId)
            console.log(`${userObj.username} joined ROOM: ${roomId}.`);
        } else {
            console.log("Room already full.")
            socket.emit('room-error', "Room already full.")
        }

        socket.to(roomId).broadcast.emit('user-connected', userObj)

        socket.on('message', (data) => {
            console.log(`${data.username} send: `, data.txt)
            socket.to(roomId).broadcast.emit('message', data);
        });

        socket.on('piano-key', (pianoData) => {
            console.log("Playing: ", pianoData)
            socket.to(roomId).broadcast.emit('piano-key', pianoData);
        });

        socket.on('disconnect', () => {
            console.log(`${userObj.username} disconnect from ROOM: ${roomId}.`);
            socket.to(roomId).broadcast.emit('user-disconnected', userObj)
        })
    })
});

server.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});