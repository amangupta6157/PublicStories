import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { engine } from "express-handlebars";
import morgan from "morgan";
import router from "./routes/index.js";
import authRouter from "./routes/auth.js";
import passport from "passport";
import configPassport from "./config/configPassport.js";
import session from "express-session";
import MongoDBStoreFactory from "connect-mongodb-session";
import storyRouter from "./routes/stories.js";
import methodOverride from "method-override";
import {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} from "./helpers/hbs.js";

//Load config
dotenv.config({ path: "./config/config.env" });

//Passport config
configPassport();

connectDB();

const app = express();

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(
  ".hbs",
  engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Create a new instance of MongoDBStore with the required doptions
const MongoDBStore = MongoDBStoreFactory(session);

//Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
      uri: process.env.MONGO_URI,
      collection: "sessions",
    }),
  })
);

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", router);
app.use("/auth", authRouter);
app.use("/stories", storyRouter);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
