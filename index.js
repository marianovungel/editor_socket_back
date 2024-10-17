require('dotenv').config()
const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const morgan = require("morgan")
const {Server} = require("socket.io")

app.use(cors());
app.use(morgan('dev'));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

io.on("connection",  (socket)=>{
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    });

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id)
    });
    socket.on('send', (data)=>{
        socket.to(data.room).emit("recive_message", data)
    });
})

server.listen(process.env.PORT, ()=>{
    console.log(process.env.PORT)
})