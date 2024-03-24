const { Router } = require("express");
const {
    handleContiniousAuthChecks,
    handleSignIn,
    handleSignUp
} = require("./controllers/auth");
const getUser = require("./controllers/Users/getUser");
const verifyUser = require("./middleware/verifyUser");

const router = new Router();

router.post("/signin", handleSignIn);
router.post("/signup", handleSignUp);
router.post("/verify", handleContiniousAuthChecks);
router.get("/getUser", verifyUser, getUser)

module.exports = router;