export const requireAuth = (req, res, next) => {
  // Add proper null checks
  if (!req.session || !req.session.user) {
    console.log("Unauthorized access attempt - Session:", req.session);
    return res.status(401).json({
      message: "Unauthorized - Please log in first",
      sessionData: req.session, // For debugging
    });
  }
  next();
};
