import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../auth/firebase";
import Company from "../model/company";
import { CLIENTURL } from "../env";

export const getUserData = (userId: string) => {
  return Company.findAll({
    where: {
      userId: userId,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("Error: ", error);
      return null;
    });
};

export const getCompanyDataGroupedById = () => {
  return Company.findAll({
    raw: true,
  })
    .then((data: any) => {
      return data.reduce((result: any, record: any) => {
        const existingEntry = result.find(
          (entry: any) => entry.userId === record.userId
        );

        if (existingEntry) {
          existingEntry.companies.push({
            id: record.id,
            companyName: record.companyName,
            numberOfUsers: record.numberOfUsers,
            numberOfProducts: record.numberOfProducts,
            percentage: record.percentage,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          });
        } else {
          result.push({
            userId: record.userId,
            companies: [
              {
                id: record.id,
                companyName: record.companyName,
                numberOfUsers: record.numberOfUsers,
                numberOfProducts: record.numberOfProducts,
                percentage: record.percentage,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
              },
            ],
          });
        }
        return result;
      }, []);
    })
    .catch((error: any) => {
      console.log("Error: ", error);
      return null;
    });
};

export const getASingleCompanyData = (userId: string) => {
  return Company.findByPk(userId)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("Error: ", error);
      return null;
    });
};

export const deleteCompanyData = (dataId: string) => {
  return Company.destroy({
    where: {
      id: dataId,
    },
  })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log("Error: ", error);
      return null;
    });
};

export const writeCompanyDataToDatabase = async (data: any) => {
  return Company.create(data)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

export const updateCompanyData = async (id: string, data: any) => {
  let companyData = await getASingleCompanyData(id);
  if (!companyData) {
    return false;
  }
  companyData = {
    ...companyData,
    ...data,
  };
  return companyData!
    .save()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

//middleware
export const validateSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { origin } = req.headers;
  if (!origin || origin !== CLIENTURL) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "Bad request",
    });
  }
  next();
};

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: "Unauthorized",
    });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: "Unauthorized",
    });
  }
  const isTokenValid = await verifyToken(token);
  if (isTokenValid) {
    req.body.decodedToken = isTokenValid.uid;
    next();
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: "Unauthorized",
    });
  }
};
