const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {
    requireAuth(req, res, next) {
        try {
            const authHeader = req?.headers?.authorization || '';
            if (!authHeader) {
                return res.status(401).json({ status: 'error', message: 'Missing authorization header.' });
            }

            const token = authHeader.split(' ')[1];
            const verifiedToken = jwt.verify(token, JWT_SECRET);

            req.userId = verifiedToken.userId;

            next();
        } catch (error) {
            res.status(401).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = authMiddleware;