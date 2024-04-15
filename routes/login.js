var express = require("express");
const userModel = require("../models/user");
var router = express.Router();

/*
 * Ruta para iniciar sesión.
 * Verifica las credenciales del usuario y establece la sesión.
 */
router.post("/", function (req, res, next) {
    if (req.body.username && req.body.userPassword) {
        console.log(req.body);

        const user = userModel.find(
        (user) =>
            user.username === req.body.username &&
            req.body.userPassword === user.password
        );

        console.log(user);

        if (user) {
        req.session.userName = user.username;
        req.session.userRole = user.role;
        return res.redirect("/");
        }
    }
    return res.redirect(303, "/login/bad-login");
});

/*
 * Ruta para mostrar mensaje de inicio de sesión incorrecto.
 */
router.get("/bad-login", function (req, res, next) {
    res.send("Usuario incorrecto, inicie sesion nuevamente");
});

module.exports = router;