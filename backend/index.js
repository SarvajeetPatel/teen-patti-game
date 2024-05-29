import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuid } from 'uuid'

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: ["http://192.168.1.101:3000", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('Invalid username'))
    }

    socket.username = username
    socket.userId = uuid()
    next()
})

io.on("connection", async (socket) => {
    const users = []
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userId: socket.userId,
            username: socket.username
        })
    }

    socket.emit('users', users)
    socket.emit('session', { userId: socket.userId, username: socket.username })
    socket.broadcast.emit('user connected', { userId: socket.userId, username: socket.username })
})
console.log('App listening on PORT 4000')

httpServer.listen(process.env.PORT || 4000)