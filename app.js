require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/dbConfig/db");
const cookieParser = require("cookie-parser");  
const MongoStore = require('connect-mongo').default;
const session = require("express-session");
const methodOverride = require("method-override");
// const flash = require("express-flash");
const flash = require("connect-flash");
// const bodyParser = require('body-parser')

const {isActiveRoute, readingTime } = require('./server/helpers/routeHelpers')

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

//MIDDLE WARE
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
// app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
// app.use(bodyParser.json()); // Send JSON responses

// FLASH SETUP
app.use(flash({ sessionKeyName: "flashMessage" }));


app.locals.isActiveRoute = isActiveRoute;
app.locals.readingTime = readingTime;

// Express Session
app.use(session({
  secret: 'keboard cat',
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
  store: MongoStore.create({mongoUrl: process.env.MONGODB_URI}),
  cookie: {maxAge: 1000 * 60 * 60 * 24}
}))

// Static Files
app.use(express.static("public"));

// Template Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});