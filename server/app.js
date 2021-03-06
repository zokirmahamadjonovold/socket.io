const express = require('express');
let app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
const http = require('http');
let server = http.createServer(app);
let io = socketIO(server);
const db = require('./db');
const { redirect } = require('express/lib/response');

// configs
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// routes
app.use('/', require('./routes/index'));
app.use('/room', require('./routes/room'));

io.on('connection', (socket) => {
    socket.on('join', (msg)=> {
        let user = db.find(e => e.username == msg);
        if (user) {
            socket.emit('old username', 'Username is allready used');
        }else {
            io.emit('redirect', '/room');
        } 
    });
    socket.on('sendMessage', (msg) => {
        console.log(msg);
    });
});



// run server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});