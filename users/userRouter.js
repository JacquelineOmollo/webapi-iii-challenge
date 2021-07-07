const express = require("express");
const User = require("./userDb");
const Post = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const user = req.body;
  User.insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Mistake getting User" });
    });
});

router.post("/:id/posts", validatePost, validateUserId, (req, res) => {
  const post = req.body;
  Post.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "User was not added" });
    });
});

router.get("/", (req, res) => {
  User.get()
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

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  User.getUserPosts(id)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Mistake was made getting user posts" });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.user.id;
  User.remove(id)
    .then(user => {
      res.status(200).json({ message: "It's working" });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Mistake deleting the user" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  User.update(id, { name })
    .then(() => {
      User.getById(id)
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
//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  });
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "missing user data" });
  }
  if (typeof name !== "string") {
    return res.status(400).json({ message: "missing required name field" });
  }
  req.body = { name };
  next();
}

function validatePost(req, res, next) {
  const { id: user_id } = req.params;
  const { text } = req.body;

  if (!req.body) {
    return res.status(400).json({ message: "missing post data" });
  }
  if (!text) {
    return res.status(400).json({ message: "missing required text field" });
  }

  req.body = { user_id, text };
  next();
}

module.exports = router;
