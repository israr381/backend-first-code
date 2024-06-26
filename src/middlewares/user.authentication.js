import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/APIError.js";

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new ApiError(401, 'Unauthorized: No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, 'Unauthorized: Invalid token');
    }
};

export {authenticate};
