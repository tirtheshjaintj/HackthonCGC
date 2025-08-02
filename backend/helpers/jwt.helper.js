import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
const expiresIn = process.env.TOKEN_EXPIRATION || "1h";

export const setUser = (user) => {
    const options = { expiresIn };
    return jwt.sign({ id: user._id }, JWT_SECRET, options);
};

export const getUser = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error(error);
        return null;
    }
};
