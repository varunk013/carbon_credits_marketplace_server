const { Router } = require("express");
const {
    handleContiniousAuthChecks,
    handleSignIn,
    handleSignUp
} = require("./controllers/auth");

const router = new Router();

router.post("/signin", handleSignIn);
router.post("/signup", handleSignUp);
router.post("/verify", handleContiniousAuthChecks);

module.exports = router;