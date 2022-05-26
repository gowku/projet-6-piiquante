const express = require("express");

require("dotenv").config();
// console.log(process.env.DB_USERNAME);

//ajoute des sécurités helmet
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require(`body-parser`);
const mongoose = require("mongoose");
const path = require(`path`);

const saucesRoutes = require("./routes/sauces");
const userRoutes = require(`./routes/user`);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.BD_PASSWORD}@cluster0.ablrv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "example.com"],
      "style-src": null,
    },
  })
);

app.use(morgan("dev"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(bodyParser.json());

app.use(`/images`, express.static(path.join(__dirname, `images`)));

app.use("/api/sauces", saucesRoutes);
app.use(`/api/auth`, userRoutes);

module.exports = app;
