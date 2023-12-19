// for real-time connections.
const socketIO = require('socket.io');

let io;

function initializeSocketIO(server) {
    io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('Client connected');
    });
}

function sendOrderNotification(order) {
    // Gửi thông báo tới chủ nhà hàng
    io.emit('newOrderNotification', order);
}

module.exports = {
    initializeSocketIO,
    sendOrderNotification,
};