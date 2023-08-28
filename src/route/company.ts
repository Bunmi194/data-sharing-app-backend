import express, { Request, response, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  validateSession,
  validateToken,
  writeCompanyDataToDatabase,
  getUserData,
  getCompanyDataGroupedById,
} from "../controller/company";
import { checkIfUserExists, adminAuth } from "../controller/user";

const route = express.Router();

//add data
route.post(
  "/",
  validateSession,
  validateToken,
  checkIfUserExists,
  async (req: Request, res: Response) => {
    const { userId, companyName, numberOfUsers, numberOfProducts, percentage } =
      req.body;
    try {
      const data = {
        userId,
        companyName,
        numberOfUsers: Number(numberOfUsers),
        numberOfProducts: Number(numberOfProducts),
        percentage: Number(percentage),
      };
      const writtenData = await writeCompanyDataToDatabase(data);
      if (!writtenData) {
        return res.status(StatusCodes.FAILED_DEPENDENCY).json({
          status: false,
          message: "Please try again",
        });
      }

      return res.status(StatusCodes.CREATED).json({
        status: true,
        writtenData,
        message: "Data was successfully created",
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
);

route.put("/:id", (req, res) => {
  //get and validate session
  //get and validate token
  //check if user exists
  //edit data in DB
}); //edit

route.delete("/:id", (req, res) => {
  //get and validate session
  //get and validate token
  //check if user exists
  //delete data into DB
}); //delete data

//return all data by id for user
route.get(
  "/:id",
  validateSession,
  validateToken,
  checkIfUserExists,
  async (req: Request, res: Response) => {
    const { decodedToken } = req.body;
    const { id } = req.params;
    try {
      const records = await getUserData(decodedToken);
      if (!records) {
        return res.status(StatusCodes.FAILED_DEPENDENCY).json({
          status: false,
          message: "Please try again",
        });
      }
      if (decodedToken !== id) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: false,
          message: "Unauthorized",
        });
      }
      return res.status(StatusCodes.OK).json({
        status: true,
        records,
        message: "Records fetched successfully",
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
);

//admin

//return all data by id for admin
route.get(
  "/admin/:id",
  validateSession,
  validateToken,
  adminAuth,
  async (req: Request, res: Response) => {
    // const { decodedToken } = req.body;
    const { id } = req.params;
    try {
      const records = await getUserData(id);
      if (!records) {
        return res.status(StatusCodes.FAILED_DEPENDENCY).json({
          status: false,
          message: "Please try again",
        });
      }
      return res.status(StatusCodes.OK).json({
        status: true,
        records,
        message: "Records fetched successfully",
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
);

//group data by id and return as stats for admin
route.get(
  "/statistics/admin",
  validateSession,
  validateToken,
  adminAuth,
  async (req, res) => {
    try {
      const allCompanyData = await getCompanyDataGroupedById();
      return res.status(StatusCodes.OK).json({
        status: true,
        records: allCompanyData,
        message: "Statistics fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
);

const companyRoutes = route;
export default companyRoutes;
