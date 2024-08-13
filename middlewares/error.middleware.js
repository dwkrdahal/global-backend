export const errorMiddleware = (err, req, res, next) => {
  let code = err.status || 500
  let msg = err.msg || "internal server error"
  res.status(code).json({
    result: err,
    status: false,
    msg: msg
  })
}