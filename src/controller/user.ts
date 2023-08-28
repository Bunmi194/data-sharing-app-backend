import { Request, Response, NextFunction } from "express";
import { validateUserInputOnSignup } from "../auth/zod";
import { StatusCodes } from "http-status-codes";
import { UserData } from "../model/user";
import User from "../model/user";
import { verifyToken, emailExists } from "../auth/firebase";


export const writeUserToDatabase = async (user: any) => {
  return User.create(user)
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};


const userExists = (email: string) => {
  return User.findOne({ where: { email } })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return null;
    });
};


export const userExistsWithId = (id: string) => {
  return User.findOne({ where: { id } })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return null;
    });
};

export const compareUserForAuthentication = async (
  id: string,
  email: string
) => {
  const user = await userExistsWithId(id);
  if (user && user.email === email) {
    return true;
  }
  return false;
};

export const doesUserExists = async (email: string) => {
  try {
    //check if user exists
    const user = (await userExists(email)) as unknown as UserData;
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(`Error: ${error}`);
    return null;
  }
};

export const updateUserProfile = async (id: string, url: string) => {
  let userData = await userExistsWithId(id);
  if (!userData) {
    return false;
  }
  userData.profile = url;
  return userData!
    .save()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

export const getAllUsers = () => {
  return User.findAll()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("Error: ", error);
      return null;
    });
};

//middleware
export const validateUserInputOnSignUpMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //validate user input
    const error = validateUserInputOnSignup.safeParse(req.body);
    if (error.success === false) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: error.error.issues[0].message,
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "Please enter valid inputs",
    });
  }
};

export const checkIfTokenExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: "No authorization headers",
    });
  }
  try {
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: "No token",
      });
    }
    req.body.token = token;
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const checkIfEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const userRecord = await emailExists(email);
    userRecord ? (req.body.emailExists = true) : (req.body.emailExists = false);
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};


export const validateUserTokenOnLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: "Please provide a token",
    });
  }
  try {
    const userRecord = await verifyToken(token);
    if (userRecord) {
      req.body.id = userRecord.uid;
      next();
      return;
    }
    return res.status(StatusCodes.FORBIDDEN).json({
      status: false,
      message: "Bad token",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};


export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { decodedToken } = req.body;

  try {
    const user = await userExistsWithId(decodedToken);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: "Unauthorized",
      });
    }
    if (user.admin !== true) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: "Unauthorized",
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const checkIfUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { decodedToken } = req.body;
  try {
    const user = await userExistsWithId(decodedToken);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "User is unathourized.",
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

