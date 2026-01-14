import bcrypt from "bcrypt";

// Utility function to hash passwords
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
