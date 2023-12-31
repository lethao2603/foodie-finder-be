// const AppError = require("../utils/appError.util");

// const handleJWTError = err => new AppError('Invalid token. Please log in again !', 401)

// const sendErrorDev = (err, res) => {
//     res.status(err.statusCode).json({
//         status: err.status,
//         error: err,
//         message: err.message,
//         stack: err.stack
//     });
// };

// const sendErrorProd = (err, res) => {
//     if(err.isOperational) {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message
//         });
//     } else {
//         //Log error
//         console.error(' ERROR: ', err);

//         res.status(500).json({
//             status: 'error',
//             message: 'Something went very wrong!'
//         });
//     }
// }; 

// module.exports = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
//     if (process.env.NODE_ENV === 'development') {
//         sendErrorDev(err, res);
//     } else if (process.env.NODE_ENV==='production') {
//         let error = {...err};

//         if(error.name === 'JsonWebTokenError') 
//             error = handleJWTError(error);

//             sendErrorProd(error, res);
//     }
// }