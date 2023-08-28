import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserData } from "../model/user";
import admin from "../config/firebase";
import {
  validateUserInputOnSignUpMiddleware,
  checkIfEmailExists,
  writeUserToDatabase,
  checkIfTokenExists,
  validateUserTokenOnLogin,
  doesUserExists,
  adminAuth,
  getAllUsers,
  updateUserProfile,
} from "../controller/user";
import {
  getUserData,
  validateSession,
  validateToken,
} from "../controller/company";
import { encryptData } from "../utils/crypto";
import { cloudinaryUpload, upload } from "../config/cloudinary";

const route = express.Router();

route.post(
  "/register",
  validateUserInputOnSignUpMiddleware,
  checkIfEmailExists,
  async (req, res) => {
    if (req.body.emailExists) {
      return res.status(StatusCodes.CONFLICT).json({
        status: false,
        message: "Email already exists",
      });
    }
    try {
      const newUser = await admin.auth().createUser({
        displayName: req.body.name,
        email: req.body.email,
        password: req.body.password,
        emailVerified: true,
      });
      const savedUserInDatabase = await writeUserToDatabase({
        id: newUser.uid,
        name: req.body.name,
        email: req.body.email,
      });
      if (savedUserInDatabase) {
        return res.status(StatusCodes.CREATED).json({
          status: true,
          message: "Sign up successful",
        });
      }
      return res.status(StatusCodes.FAILED_DEPENDENCY).json({
        status: false,
        message: "Please try again later",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
); //signup

//login

route.post(
  "/login",
  checkIfTokenExists,
  validateUserTokenOnLogin,
  async (req, res) => {
    const { email, id, token } = req.body;
    try {
      const user = (await doesUserExists(email)) as unknown as UserData;
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: `User ${email} does not exist`,
        });
      }
      if (user.id !== id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: `Forbidden request`,
        });
      }
      //get user data
      const userData = (await getUserData(id)) as unknown as UserData;

      res.setHeader("x-api-key", encryptData(email));

      return res.status(StatusCodes.OK).json({
        status: true,
        userData,
        token,
        user,
        message: "Login successful",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
); //login

//admin
route.post(
  "/edit",
  validateSession,
  validateToken,
  adminAuth,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "No image file",
      });
    }

    try {
      cloudinaryUpload.uploader
        .upload_stream(async (error, result: any) => {
          if (error) {
            console.log("Error uploading image: ", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              status: false,
              message: "Internal Server Error",
            });
          }
          const updateUserPhoto = await updateUserProfile(
            id,
            result.secure_url
          );
          if (!updateUserPhoto) {
            return res.status(StatusCodes.FAILED_DEPENDENCY).json({
              status: false,
              message: "Please try again later",
            });
          }
          return res.status(StatusCodes.OK).json({
            status: true,
            records: result,
            message: "Upload successful",
          });
        })
        .end(req.file.buffer);
    } catch (error) {
      console.log("Error: ", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
);

//return all users
route.get(
  "/",
  validateSession,
  validateToken,
  adminAuth,
  async (_req: Request, res: Response) => {
    try {
      const allUsers = await getAllUsers();
      return res.status(StatusCodes.OK).json({
        status: true,
        records: allUsers,
        message: "Users fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
); //return all users to admin

const userRoutes = route;
export default userRoutes;
