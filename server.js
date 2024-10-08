require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectMongoDb } = require("./connect");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog");
//
const app = express();
const port = process.env.PORT || 8000;

//connect mongoDb
connectMongoDb(process.env.MONGODB_URL);

//set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middleware
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

//routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  // console.log(req.user);

  res.render("home", {
    user: req.user,
    blog: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
