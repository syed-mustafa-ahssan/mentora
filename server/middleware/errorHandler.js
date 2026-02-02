// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Send error response
    res.status(err.status || 500).json({
        error: err.message || "Something went wrong!",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
