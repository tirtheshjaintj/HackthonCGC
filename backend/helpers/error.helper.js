// Custom Error Class
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    console.error(err); // log full error

    res.status(status).json({
        status: false,
        message: err.message || "Internal Server Error"
    });
};




