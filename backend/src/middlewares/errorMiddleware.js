function errorMiddleware(err, req, res, next) {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server Error",
    error: process.env.NODE_ENV === "production" ? undefined : String(err.stack || err),
  });
}

module.exports = { errorMiddleware };
