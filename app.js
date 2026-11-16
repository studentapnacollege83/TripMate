/* cd "C:\Users\ADMIN\Desktop\tripMate" */
//npx @tailwindcss/cli -i ./input.css -o ./public/output.css
//npx @tailwindcss/cli -i ./input.css -o ./public/output.css --watch
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);
//routers

const authRouter = require("./routes/authRouter");
const tripRouter = require("./routes/tripRouter");
const homeRouter=require("./routes/homeRouter")
const weatherRouter = require("./routes/weatherRouter");
const placesRouter = require("./routes/placesRouter");
//
const app = express();


const PORT = process.env.PORT || 3000
const DB_PATH = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!DB_PATH || !SESSION_SECRET) {
  throw new Error("MONGODB_URI and SESSION_SECRET must be set in .env");
};
// MongoDB Session Store
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions"
});

store.on("error", (error) => {
  console.error("Session store error:", error.message);
});
// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

;

// Session Middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);


app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use("/", authRouter);
app.use("/", homeRouter)
app.use("/", tripRouter);
app.use("/", weatherRouter);
app.use("/", placesRouter);
// Change "process.env.DB_PATH" to just "DB_PATH"
mongoose
  .connect(DB_PATH) 
  .then(() => {
    console.log("✅ Connected to MongoDB successfully.");

app.listen(PORT, () => {
  console.log(`🚀 Web server active at: http://127.0.0.1:${PORT}`);
}).on("error", (error) => {
  console.error("❌ Server startup error:", error);
});})
//save nhi ho rhii intinary and expenses , regenrate main tripmat page 