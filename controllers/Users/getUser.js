require("dotenv").config();
const { User: UsersModel } = require("../../models/user");

const getUser = async (request, response) => {
  try {
    const { email } = request.user;
    const isUserExists = await UsersModel.find({ email });

    if (isUserExists.length === 0) {
      return response.status(400).json({
        sucess: false,
        message: "User does not exists",
      });
    }

    const user = isUserExists[0];
    const { firstName, lastName } = user;
    return response.status(200).json({
        sucess: true,
        message: "User Found",
        user: {
            firstName,
            lastName, 
            email
        }
    })
  } catch (error) {
    return response.status(504).json({
      sucess: false,
      error: error.message,
    });
  }
};

module.exports = getUser;