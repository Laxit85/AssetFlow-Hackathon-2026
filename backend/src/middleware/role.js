/**
 * Middleware to authorize users based on roles.
 * Normalizes roles to uppercase to support case-insensitive checks.
 * @param {...string} roles - The list of allowed roles.
 */
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toUpperCase();
    const allowedRoles = roles.map(r => r.toUpperCase());
    
    if (!req.user || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        errors: [`Role '${req.user?.role || "unknown"}' is not authorized to access this resource`]
      });
    }
    next();
  };
};
