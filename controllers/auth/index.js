require("dotenv").config();
const { User: UsersModel } = require("../../models/user");
const {
  RequiredVaulesValidator,
} = require("../../utils/requiredValuesChecker");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const saltRounds = 10;

const handleSignIn = async (request, response) => {
  try {
    const required = ["email", "password"];
    const isValid = RequiredVaulesValidator(request, response, required);
    if (isValid) {
      const { email, password } = request.body;
      const isUserExists = await UsersModel.find({ email });

      if (isUserExists.length === 0) {
        return response.status(400).json({
          sucess: false,
          message: "User does not exists",
        });
      }

      const user = isUserExists[0];
      const { firstName, lastName } = user;
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return response.status(404).json({
          success: false,
          message: "Wrong Password",
        });
      }

      const accessToken = await JWT.sign(
        { firstName, lastName, email },
        process.env.JWTACCESSKEY,
        { expiresIn: "1h" }
      );
      const refreshToken = await JWT.sign(
        { firstName, lastName, email },
        process.env.JWTREFRESHKEY,
        { expiresIn: "10h" }
      );

      response.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        httpOnly: true,
      });
      response.cookie("refreshToken", refreshToken, {
        maxAge: 36000000000,
        httpOnly: true,
      });

      return response.status(200).json({
        sucess: true,
        message: "Login Sucessfull",
        user: {
          firstName,
          lastName,
          email,
        },
      });
    }
  } catch (error) {
    return response.status(504).json({
      sucess: false,
      error: error.message,
    });
  }
};

const handleSignUp = async (request, response) => {
  try {
    const required = ["firstName", "lastName", "email", "password"];
    const isValid = RequiredVaulesValidator(request, response, required);
    if (isValid) {
      const { firstName, lastName, email, password } = request.body;
      const isUserExists = await UsersModel.find({ email: email });

      if (isUserExists.length > 0) {
        // if user exists
        return response.status(201).json({
          sucess: true,
          message: "User Already exists signin",
        });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await UsersModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const accessToken = await JWT.sign(
        { firstName, lastName, email },
        process.env.JWTACCESSKEY,
        { expiresIn: "1h" }
      );
      const refreshToken = await JWT.sign(
        { firstName, lastName, email },
        process.env.JWTREFRESHKEY,
        { expiresIn: "10h" }
      );

      response.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        httpOnly: true,
      });
      response.cookie("refreshToken", refreshToken, {
        maxAge: 36000000000,
        httpOnly: true,
      });

      return response.status(200).json({
        sucess: true,
        message: "Sign Up Sucessfull",
        user: {
          firstName,
          lastName,
          email,
        },
      });
    }
  } catch (error) {
    return response.status(504).json({
      sucess: false,
      error: error.message,
    });
  }
};

const handleContiniousAuthChecks = async (request, response) => {
  try {
    if (request.headers.cookie) {
        let refreshToken;
        if((request.headers.cookie.split("; ")).length === 1) {
            refreshToken = request.headers.cookie.split("=")[1];

        } else {
            refreshToken = request.headers.cookie.split("; ")[1].split("=")[1];

        }

      const decoded = JWT.verify(refreshToken, process.env.JWTREFRESHKEY);
      if (!decoded) {
        return response.status(401).json({
          sucess: false,
          message: "Invalid Refresh Token",
        });
      }
      const isUserExists = await UsersModel.find({ email: decoded.email });

      if (isUserExists.length === 0) {
        return response.status(404).json({
          sucess: false,
          message: "User does not exists",
        });
      }

      const { firstName, lastName, email } = isUserExists[0];
      const accessToken = await JWT.sign(
        { firstName, lastName, email },
        process.env.JWTACCESSKEY,
        { expiresIn: "1h" }
      );
      response.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        httpOnly: true,
      });

      return response.status(200).json({
        success: true,
        message: "Auth Verified",
        user: {
          firstName,
          lastName,
          email,
        },
      });
    }

    return response.status(404).json({
        success: false,
        message: "Not Logged In",
      });
  } catch (error) {
    console.log(error)
    return response.status(504).json({
      sucess: false,
      error: error.message,
    });
  }
};

module.exports = {
  handleContiniousAuthChecks,
  handleSignIn,
  handleSignUp,
};
