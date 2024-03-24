require("dotenv").config();
const { User: UsersModel } = require("../models/user");
const JWT = require("jsonwebtoken");

const verifyUser = async(request, response, next) => {
    try {

        const accessToken = request.headers.cookie.split("; ")[0].split("=")[1];
        const decoded = JWT.verify(accessToken, process.env.JWTACCESSKEY);
        if(!decoded) {
            return response.status(401).json({
                message: "User does not exists"
            });
        }

        const isUserExists = await UsersModel.find({ email: decoded.email });
        if(isUserExists.length === 0) {
            return response.status(404).json({
                message: "User does not exists"
            });
        }
        const { firstName, lastName, email } = isUserExists[0];
        request.user = {
            firstName, lastName, email
        }
        next();

    } catch(error) {
        return response.status(401).json({
            message: "User does not exists"
        });
    }
}

module.exports = verifyUser;