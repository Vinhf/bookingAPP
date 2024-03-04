const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Import mongoose
const app = express();
const uri =
  "mongodb+srv://vinhntce171035:Vinh0945509444@cluster0.bc1fana.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("./models/User.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const bcryptSalt = bcryptjs.genSaltSync(10);
const jwtSecret = "giangKhungboVinhHoaiHuHUHUHUHUHU";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(uri);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcryptjs.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcryptjs.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.json("password not ok");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
       const {name,email,_id} = await User.findById(userData.id);    
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
  res.json("user infor");
});

app.listen(4000);
