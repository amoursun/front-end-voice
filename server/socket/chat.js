const http = require('http');
const {Server} = require('socket.io');
const express = require('express');
const cors = require('cors');
const {getId} = require('../utils/util-id');

const app = express();
// app.use(cors({
//     origin: '*', // 指定允许的来源，'*'表示接受所有域名的请求
//     optionsSuccessStatus: 204,
//     // GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
//     methods: '*', // 指定允许的请求方法
//     allowedHeaders: '*', // 指定允许的请求头
//     credentials: true // 指定是否允许发送Cookie
// }));
app.use('*', (req, res, next) => {
    res.set({
        // 'Content-Type': 'text/event-stream',
        // 'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Credentials': 'true', // 允许发cookie
        'Access-Control-Allow-Origin': '*', // 允许跨域
        'Access-Control-Allow-Headers': '*', // 允许请求头
        'Set-Cookie': 'test=123; path=/; domain=127.0.0.1; HttpOnly',
        'Content-Language': 'utf-8',
        'Access-Control-Allow-Methods': '*',
    });
    next();
});
const server = http.createServer(app);
const io = new Server(server, {
    // cors: true, // 允许跨域
    cors: {
        origin: '*',
        // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD', 'CONNECT', 'TRACE'],
        // methods: '*',
        // allowedHeaders: '*',
        // credentials: true, // 允许发送cookie
    },
    pingTimeout: 60000,
});
const groups = {};
/**
 * [{1008:[{name,room,id}]}]
 */
io.on('connection', (socket) => {
    //加入房间
    socket.on('join', ({user, room}) => {
        socket.join(room);
        if (groups[room]) {
            groups[room].push({user, room, id: socket.id});
        } else {
            groups[room] = [{user, room, id: socket.id}];
        }
        // 发送到当前请求的客户端
        socket.emit('message', {user: '管理员', text: `${user}进入了房间`, room, id: getId()});
        socket.emit('groups', groups);
        // 发送到除发送者以外的所有客户端
        socket.broadcast.emit('groups', groups);
    })
    // 发送消息
    socket.on('message', ({text, room, user}) => {
        console.log('on-message', {text, room, user});
        const info = {
            text,
            user,
            room,
            id: getId(),
        };
        // 发送到room房间的 除发送者以外的所有用户
        socket.broadcast.to(room).emit('message', info);
        socket.emit('message', info);
    })
    // 断开链接内置事件
    socket.on('disconnect', () => {
        Object.keys(groups).forEach(key => {
            const data = groups[key].find(item => item.id === socket.id)
            if (data) {
                socket.broadcast
                    .to(data.room)
                    .emit('message', {user: '管理员', text: `${data.user}离开了房间`, room: data.room, id: getId()});
            }
            groups[key] = groups[key].filter(item => item.id !== socket.id)
        })
        socket.broadcast.emit('groups', groups)
    })
});

server.listen(3888, () => {
    console.log('listening on *:3888');
});
