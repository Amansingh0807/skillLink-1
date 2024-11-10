import jwt from 'jsonwebtoken'

export default function auth(req, res, next) {

    const authHeader = req.cookies.access_token

    if (!authHeader) {
        return res.status(401).json({
            error: "No auth token found! , Login again"
        });
    }

    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_PASSWORD);

        if (!decoded) {
            return res.status(401).json({
                msg: "not decoded"
            })
        }
        req.userId = decoded.userID;
        next();
    }
    catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }

}