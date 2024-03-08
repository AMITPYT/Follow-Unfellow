const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const fetchuser = require('../middleware/fetchuser');
const Userpost = require('../Models/userPost');


// Add a new post
router.post("/addpost", fetchuser, async (req, res) => {
    try {
        const { content } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = new Userpost({
            user: req.user.id,
            content
        });
        const savedPost = await post.save();

        res.json({ "Success": "Post created successfully", post: savedPost });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Fetch all posts of the current user and the users they follow
router.get('/fetchposts', fetchuser, async (req, res) => {
    try {
        const currentUser = req.user.id;

        // Fetch posts of the current user and the users they follow
        const posts = await Userpost.find({ $or: [{ user: currentUser }, { user: { $in: req.user.following } }] })
            .sort({ date: -1 });

        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
