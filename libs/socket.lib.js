// for real-time connections.
const socketIo = require('socket.io');
let io;
function initializeSocket(server) {
  io = socketIo(server);

  io.on('connection', (socket) => {
    const { resInfor } = socket.handshake.query;

    if (resInfor) {
      // Tham gia room tương ứng với nhà hàng
      socket.join(resInfor);
    }

    // Lắng nghe sự kiện ngắt kết nối
    socket.on('disconnect', () => {
      // Xử lý khi ngắt kết nối
      console.log('User disconnected');
    });
  });

  return io;
};

function emitNewBookingEvent(resInfor, message, data) {
  io.to(resInfor).emit('newBooking!',message, data);
};

function emitBookingConfirmedEvent(bookingId, message, data) {
  io.to(bookingId).emit('bookingConfirmation', message, data);
}
module.exports = {initializeSocket, emitNewBookingEvent, emitBookingConfirmedEvent};