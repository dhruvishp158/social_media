const express = require("express");
const router = express.Router();
const Post = require("../../Models/Post");
const auth = require("../../middleware/auth");
const Profile = require("../../Models/Profile");
const Users = require("../../Models/Users");
const { check, validationResult } = require("express-validator"); //check express validation docs
const request = require("request");
const config = require("config");

//@route  post api/posts
//@desc   create a post
//@access public
router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await Users.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//@route  get api/posts
//@desc   get all posts
//@access private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//@route  get api/posts/:id
//@desc   get posts by id
//@access private

router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(400).json({ msg: "post not found!" });
    }
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "post not found!" });
    }
    res.status(500).send("server error");
  }
});

//@route  delete api/posts/:id
//@desc   delete post
//@access private

router.delete("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    //if post not exist
    if (!posts) {
      return res.status(400).json({ msg: "post not found!" });
    }
    //if post user and logged in user is not same
    if (posts.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "User is not authorized" });
    }
    await posts.remove();
    res.json("posts removed");
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "post not found!" });
    }
    res.status(500).send("server error");
  }
});

//@route  put api/posts/likes/:id
//@desc   like a post
//@access private

router.put("/likes/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the post has been alreay liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "This post has alreay been liked.!" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//@route  put api/posts/unlikelikes/:id
//@desc   unlike a post
//@access private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the post has been alreay liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ msg: "This post has not been liked yet.!" });
    }
    //get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//@route  post api/posts/comment/:id
//@desc   add comment to post
//@access private
router.post(
  "/comment/:id/:comment_id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await Users.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//@route  delete api/posts/comment/:id/:comment_id
//@desc   delete comment
//@access private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //if post not exist
    if (!comment) {
      return res.status(404).json({ msg: "comment not found!" });
    }
    //if post user and logged in user is not same
    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "User is not authorized" });
    }
    //get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "post not found!" });
    }
    res.status(500).send("server error");
  }
});
module.exports = router;
