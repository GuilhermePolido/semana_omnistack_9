const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-xzzak.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//socket
const connectUsers = {};//mais correto é salvar num banco de dados os user conectados, pois se reiniciar o servidor ele vai perder esses dados

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;
    connectUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectUsers = connectUsers;

    return next(); //continuar app
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

// req.query = get
// req.params = put e delete
//req.body = post

server.listen(3333);
