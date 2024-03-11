export default class CustomError extends Error {
  statusCode?: number;
  from: string;

  constructor(from: string, message: string, statusCode: number = 500) {
    super(message);
    this.from = from;
    this.statusCode = statusCode;
  }
}
