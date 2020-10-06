const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const Course = require("../models/course");
const User = require("../models/user");

router.get(
  "/my-courses",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const myCourses = await Course.find({ author: req.user._id }).sort([
      ["createdAt", -1],
    ]);
    res.json(myCourses);
  }
);

// Register
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const author = await User.findById(req.user._id);
    let newCourse = new Course({
      title: req.body.title,
      body: req.body.body,
      author,
    });
    newCourse.save((err, result) => {
      if (err) {
        res.json({ success: false, msg: "Failed to Post Course" });
      } else {
        author.courses.push(newCourse);
        author.save();
        const dec = { ...result._doc };
        res.json({ success: true, msg: dec["_id"] });
      }
    });
  }
);
router.delete(
  "/singlepost/:courseId/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const result = await Course.findOneAndRemove(
      {
        _id: req.params.courseId,
        author: req.user._id,
      },
      (err, rst) => {
        if (err) res.json(err);
        else {
          res.status(200).json("success");
        }
      }
    );
  }
);
router.get(
  "/singlepost/:courseId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const result = await Course.findById(req.params.courseId);
    if (result) res.json(result);
    else res.sendStatus(404);
  }
);
router.post(
  "/singlepost/:courseId/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const result = await Course.findById(req.params.courseId);
    result.title = req.body.title;
    result.body = req.body.body;
    result.save((err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }
);

module.exports = router;
