import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        console.error(error);
        res.status(401);
        return next(new Error('Not authorized, token failed'));
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
    }

    if (req.user.isActive === false && req.user.role !== 'SuperAdmin') {
        res.status(403);
        return next(new Error('Account is inactive. Please contact support.'));
    }

    return next();
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};

export { protect, authorize };
