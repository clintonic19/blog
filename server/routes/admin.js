const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminLayout = "../views/layouts/adminLayout";
const secretJwt = process.env.SECRET_JWT;

/*
AUTHENTICATION
CHECK LOGIN TOKEN
 */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.render("unauthorized");
    }
    const decoded = jwt.verify(token, secretJwt);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.render("unauthorized");
  }
};

/*
GET ROUTE
ADMIN AN REGISTER 
*/
// router.get("/admin", (req, res) => {
//     res.render("admin");
// });

router.get("/admin", async (req, res) => {
  // const messages = await req.flash("success");
  try {
    res.render("admin/login", { layout: adminLayout });
    // req.flash("success", "User Created Successfully");
  } catch (error) {
    console.log("Cannot Login as an Admin", error);
  }
});

/*
POST ROUTE
ADMIN LOGIN USER 
*/
router.get("/admin/register", async (req, res) => {
  try {
    res.render("admin/register", { layout: adminLayout });
    // req.flash("success", "User Created Successfully");
  } catch (error) {
    console.log("Cannot Login as an Admin", error);
  }
});

/*
POST ROUTE
ADMIN LOGIN USER 
*/
router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = await User.create({ email, password: hashedPassword});

    // CHECK TO LOGIN USER
    const user = await User.findOne({ email });
    if (!user) {
      res.status(201).json({ msg: "Incorrect Email and Password " });
    }

    // CHECK FOR PASSWORD
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(201).json({ msg: "Incorrect Email and Password " });
    }

    const token = jwt.sign({ userId: user._id }, secretJwt);
    res.cookie("token", token, { httpOnly: true });
    // req.flash("success", "Login Successfully");
    res.redirect("/dashboard");
  } catch (error) {
    console.log("Cannot Login as an Admin", error);
  }
});

/*
POST ROUTE
ADMIN REGISTER USER 
*/

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // check for existing user if not register new user
    let existUser = await User.findOne({ email: email });
    if (existUser) {
      return { msg: "User Already Exist" };
    }

    // const newUser = await User.create({
    //     firstName, lastName, email, password
    // })

    // CREATE A NEW USER
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
     // res.status(201).json({ msg: "User Created Successfully", user });
    // req.flash("success", "User Created Successfully");
    res.redirect("/admin");
  } catch (error) {
    console.log("Cannot Login as an Admin", error);
  }
});

/*
GET ROUTE
ADMIN DASHBOARD
*/

router.get("/dashboard", authMiddleware, async (req, res) => {
  // const messages = await req.flash("success");
  try {
    const data = await Post.find();

    res.render("admin/dashboard", { data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/*
GET ROUTE
ADMIN CREATE NEW POST 
*/
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const data = await Post.find();
    // req.flash("success", "Post Created Successfully");
    res.render("admin/add-post", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/*
POST ROUTE
ADMIN CREATE NEW POST 
*/
router.post("/add-post", authMiddleware, async (req, res) => {
  // const messages = await req.flash("success");
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      author: req.userId,
      body: req.body.body,
    });
    await Post.create(newPost);
    req.flash("success", "Post Created Successfully");
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/*
GET ROUTE
ADMIN UPDATE POST 
*/
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const data = await Post.findById({ _id: req.params.id });
    // .where({state: 'published'}).populate('author')
    if (data) {
      return res.render("admin/edit-post", { data, layout: adminLayout });
    } else {
      console.log("ID not Found");
    }
    //   res.redirect("/dashboard/${req.params.id}");
  } catch (error) {
    console.log(error);
  }
});

/*
PUT ROUTE
ADMIN UPDATE POST 
*/
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const data = await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/*
DELETE ROUTE
ADMIN DELETE POST 
*/
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  // const messages = await flash("success");
  try {
    data = await Post.findByIdAndDelete({ _id: req.params.id });
    //   req.flash("success", `Deleted Successfully`);
    // req.flash("success", "Post Deleted Successfully");
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/*
GET ROUTE
ADMIN LOGOUT POST 
*/
router.get("/logout", authMiddleware, async (req, res) => {
  res.clearCookie("token");
  //res.json({ message: 'Logout successful.'});
  res.redirect("/");
});

module.exports = router;
