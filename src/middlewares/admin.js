const adminMiddleware = (req, res, next) => {
    if(req.query.admin === "true"){
      req.admin = true;
      next();
    } else {
      res.status(401).send("You are not authorized to view this page");
    }
};

export default adminMiddleware;
