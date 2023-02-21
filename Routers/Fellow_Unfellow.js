const express = require("express");
const router = express.Router();
const Follow_Unfollow = require("../Models/Fellow_Unfellow_Sch");
const { validationResult } = require("express-validator");
const fetchuser = require('../middleware/fetchuser');

router.post( "/addfollower",fetchuser,async (req, res) => {
    try {
      const { email } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new  Follow_Unfollow ({
        email,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json({"Success": "Followed Successfully",savedNote});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get('/fetchallfollower', fetchuser, async (req, res) => {
    try {
        const getallfollower = await  Follow_Unfollow .find({ user: req.user.id });
        res.json(getallfollower)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.delete('/unfollow/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it

        let unfollow = await  Follow_Unfollow .findById(req.params.id);
        if (!unfollow) {
            return res.status(404).send('Not found');
        }
        // Allow deletion only if the user own this Notic
        if (unfollow.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        unfollow = await Follow_Unfollow.findByIdAndDelete(req.params.id)
        res.json({ "Success": "UnFollowed Successfully", unfollow: unfollow });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});
 module.exports = router;
 