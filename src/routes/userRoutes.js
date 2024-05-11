const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post('/parents', userController.createParent);
router.post("/users", userController.createUser);
router.post("/distribute", userController.distributeEarnings);


module.exports = router;