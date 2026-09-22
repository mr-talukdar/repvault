import "dotenv/config";
console.log("PORT from env:", process.env.PORT);
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "./models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserLoginSchema, UserSignupSchema } from "./schema/auth.schema";
import { Authenticate } from "./middleware/Authentication";
const app = express();

const port = process.env.PORT || 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || null;
if (!JWT_SECRET_KEY) {
  console.log("No JWT");
  process.exit(1);
}

app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.u5tmmqw.mongodb.net/${process.env.MONGODB_DB_NAME}`,
  )
  .then(() => {
    console.log("Connected to DB");
  });

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Your server is up and fetching" });
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const { data, success } = UserSignupSchema.safeParse(req.body);
    if (!success)
      return res.status(400).json({
        message: "error in data",
      });
    const { name, email, age, mobile, password } = data;
    const hashedPwd = await bcrypt.hash(password, 12);
    await UserModel.create({
      name: name,
      email: email,
      age,
      mobile,
      password: hashedPwd,
    });
    res.status(201).json({
      message: "User Written",
    });
  } catch (err) {
    res.status(409).json({
      message: "User Exists",
    });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  try {
    const { data, success } = UserLoginSchema.safeParse(req.body);
    if (!success)
      return res.status(400).json({
        message: "error in data",
      });
    const user = await UserModel.findOne({
      email: data.email,
    });
    if (!user)
      return res.status(404).json({
        message: "cannot find user",
      });
    if (!(typeof user?.password === "string"))
      return res.status(403).json({
        message: "invalid password format",
      });

    const isAuth = await bcrypt.compare(data.password, user.password);
    if (!isAuth)
      return res.status(401).json({
        message: "wrong pwd",
      });
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET_KEY);
    res.status(200).json({
      message: "you are logged in",
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.use(Authenticate);

app.get("/profile", async (req: Request, res: Response) => {
  try {
    const userID = req.id;
    const user = await UserModel.findOne({
      _id: userID,
    }).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: "user not found",
    });
  }
});

app.listen(port, () => {
  console.log("The server is started at :", port);
});
