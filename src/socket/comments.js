const comment = (io) => {
    io.on('connection', socket => {
        socket.on('joinProduct' , (user) => {
            socket.join(user.productCode);
        })
        socket.on('message', ({ msg, userInfo }) => {
            io.to(userInfo.productCode).emit('chatMessage', { msg: msg, userInfo });
        });
    
    })
}

module.exports = comment;