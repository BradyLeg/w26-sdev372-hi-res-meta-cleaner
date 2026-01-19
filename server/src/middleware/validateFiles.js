// Middleware to validate uploaded files
export const validateFiles = (req, res, next) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  next();
};
