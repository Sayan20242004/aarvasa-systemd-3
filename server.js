const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

// ✅ MongoDB connection directly here
const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB(); // connect to MongoDB

require("./config/passport");

const app = express();
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS setup
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true,
}));

// Parse incoming JSON requests
app.use(express.json());

// Session middleware for Passport
app.use(session({
  secret: "otpsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true if HTTPS
    httpOnly: true,
    sameSite: "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chatbot", require("./routes/chatbot"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/subscribe", require("./routes/newsletterRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/question", require("./routes/questionRoutes"));

app.get("/", (req, res) => {
  res.send("ok");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
