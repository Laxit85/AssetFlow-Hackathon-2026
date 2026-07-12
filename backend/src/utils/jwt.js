import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for a given user ID.
 * @param {string} userId - The user ID to encode in the token.
 * @returns {string} The signed JWT token.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

/**
 * Verify a JWT token.
 * @param {string} token - The token to verify.
 * @returns {object} The decoded token payload.
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
