var express = require("express");
var router = express.Router();
let userController = require("../controllers/users");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const { CheckLogin } = require("../utils/authHandler");
const {
    ChangePasswordValidator,
    validatedResult,
} = require("../utils/validateHandler");

router.post("/register", async function (req, res, next) {
    try {
        let { username, password, email } = req.body;

        let newUser = await userController.CreateAnUser(
            username,
            password,
            email,
            "69b0ddec842e41e8160132b8"
        );

        res.send(newUser);
    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
});

router.post("/login", async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);

        if (!user) {
            return res.status(404).send({
                message: "thong tin dang nhap sai",
            });
        }

        if (user.lockTime > Date.now()) {
            return res.status(404).send({
                message: "ban dang bi ban",
            });
        }

        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save();

            let token = jwt.sign(
                {
                    id: user._id,
                },
                "secret",
                {
                    expiresIn: "1h",
                }
            );

            return res.send({
                token: token,
            });
        } else {
            user.loginCount++;

            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = Date.now() + 3600 * 1000;
            }

            await user.save();

            return res.status(404).send({
                message: "thong tin dang nhap sai",
            });
        }
    } catch (error) {
        return res.status(404).send({
            message: error.message,
        });
    }
});

router.get("/me", CheckLogin, function (req, res, next) {
    res.send(req.user);
});

router.post(
    "/change-password",
    CheckLogin,
    ChangePasswordValidator,
    validatedResult,
    async function (req, res) {
        try {
            const { oldpassword, newpassword } = req.body;
            const user = req.user;

            const isMatch = bcrypt.compareSync(oldpassword, user.password);
            if (!isMatch) {
                return res.status(400).send({
                    message: "oldpassword khong dung",
                });
            }

            const isSame = bcrypt.compareSync(newpassword, user.password);
            if (isSame) {
                return res.status(400).send({
                    message: "newpassword khong duoc trung mat khau cu",
                });
            }

            user.password = newpassword;
            await user.save();

            return res.send({
                message: "doi mat khau thanh cong",
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }
);

module.exports = router;