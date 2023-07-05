const router = require("express").Router();
const userControllers = require("../controllers/userControllers");

router.get("/api", userControllers.welcome);
router.post("/api/signup", userControllers.signup);
router.post("/api/login", userControllers.login);
router.post("/api/validate", userControllers.validate);

module.exports = router;
