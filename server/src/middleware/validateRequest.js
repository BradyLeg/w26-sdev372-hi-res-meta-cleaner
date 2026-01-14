// Middleware to validate required fields in request body
export const validateCreateUser = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      error: "first name, last name, email, and password are required",
    });
  }

  next();
};

// Middleware to validate metadata update request
export const validateMetadata = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Metadata is required",
    });
  }

  next();
};
