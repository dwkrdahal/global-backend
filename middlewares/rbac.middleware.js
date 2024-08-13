class rbacMiddleware {
  isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
      return res.status(403).json({
        result: null,
        status: false,
        msg: "frobidden! admin access required"
      })
    }
    next();
  }

  isCustomer = (req, res, next) => {
    if(req.user.role !== 'customer'){
      return res.status(403).json({
        result: null,
        status: false,
        msg: "frobidden! customer access required"
      })
    }
    next();
  }

  isProjectManager = (req, res, next) => {
    if(req.user.role !== 'project_manager'){
      return res.status(403).json({
        result: null,
        status: false,
        msg: "forbidden! project manager access required"
      })
    }
    next();
  }

  isArchitect = (req, res,next) => {
    if(req.user.role !== 'architect' ){
      return res.status(403).json({
        result: null,
        status: false,
        msg: "forbidden! architect access required"
      })
    }
    next()
  }
}

export default roleMiddleware;