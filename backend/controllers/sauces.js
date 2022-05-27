const Sauce = require("../models/sauce");
const fs = require(`fs`);
// const sauce = require("../models/sauce");
const e = require("express");

exports.createSauce = (req, res, next) => {
  console.log("je suis ici");
  console.log(req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    // ...req.body,
    imageUrl: `${req.protocol}://${req.get(`host`)}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get(`host`)}/images/${req.file.filename}`,
      }
    : { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.sauceLiked = (req, res, next) => {
  console.log(req.body.like);

  const sauceId = req.params.id;
  const userId = req.body.userId;

  Sauce.findOne({ _id: sauceId })
    .then((el) => {
      if (!el.usersLiked.includes(userId) && req.body.like == 1) {
        // si userId n'est pas dans userslike et qu on envoie 1
        console.log("je suis a 1");
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: userId },
          }
        )

          .then(() => res.status(201).json({ message: "user like 1" }))

          .catch((error) => res.status(400).json({ error }));
      } else if (el.usersLiked.includes(userId) && req.body.like == 0) {
        // si userId est dans usersliked et qu on envoie 0
        console.log("je suis a 0");

        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }
        )
          .then(() => res.status(201).json({ message: "user like 0" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (!el.usersDisliked.includes(userId) && req.body.like == -1) {
        // si userId n'est pas dans usersdislike et qu on envoie -1
        console.log("je suis a -1");
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: userId },
          }
        )
          .then(() => res.status(201).json({ message: "user like -1" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (el.usersDisliked.includes(userId) && req.body.like == 0) {
        // si userId est pas dans usersdislike et qu on envoie 0
        console.log("je suis a 0 ici");
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
          }
        )
          .then(() => res.status(201).json({ message: "user like 0 ici" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
