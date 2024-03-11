import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

const errorHandler = async (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`${error.from}:\n`, error.message);

  return res
    .status(error.statusCode!)
    .json({ message: error.from, ERROR: error.message });
};

export default errorHandler;
