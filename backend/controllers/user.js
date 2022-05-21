require("dotenv").config();
console.log(process.env.EMAIL);

const cryptojs = require("crypto-js");

const bcrypt = require(`bcrypt`);
const jwt = require("jsonwebtoken");

const User = require(`../models/user`);

exports.signup = (req, res, next) => {
  // chiffrement de l'email
  const cryptojsEmail = cryptojs.HmacSHA256(req.body.email, "${process.env.EMAIL}").toString();
  console.log("contenue");
  console.log(cryptojsEmail);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: cryptojsEmail,
        // email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: `utilisateur crée` }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  // chiffrement de l'email
  const cryptojsEmail = cryptojs.HmacSHA256(req.body.email, "${process.env.EMAIL}").toString();
  console.log("contenue");
  console.log(cryptojsEmail);

  User.findOne({ email: cryptojsEmail })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
