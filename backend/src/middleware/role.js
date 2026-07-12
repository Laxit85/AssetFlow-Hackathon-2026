/**
 * Middleware to authorize users based on roles.
 * @param {...string} roles - The list of allowed roles.
 */
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        errors: [`Role '${req.user?.role || "unknown"}' is not authorized to access this resource`]
      });
    }
    next();
  };
};
