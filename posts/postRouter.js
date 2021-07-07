const express = require("express");
const User = require("./postDb");
const Post = require("../posts/postDb");
const router = express.Router();

router.get("/", (req, res) => {
  Post.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Can't get user" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.delete("/:id", (req, res) => {
  const { id } = req.user;
  Post.remove(id)
    .then(removed => res.status(204).end(removed))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Mistake deleting the user" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  Post.update(id, { name })
    .then(() => {
      Post.getById(id)
        .then(user => res.status(200).json(user))
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "You didn't get a user" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "You didn't update user" });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id: post_id } = req.params;
  Post.getById({ id: post_id }).then(user => {
    if (user) {
      req.user_id = user_id;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  });
}

module.exports = router;
