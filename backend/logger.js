import winston from "winston";
const { combine, timestamp, printf } = winston.format;
import dotenv from "dotenv";

dotenv.config();

// makes sure only in production will it not show debug logs otherwise will show
const level = process.env.NODE_ENV === "production" ? "info" : "debug";

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
/*
    Using the four granularities:

    [debug, info, warn, error ]
    [5+, 5+, 5+, 5+]
*/

const logger = winston.createLogger({
  level,
  format: combine(winston.format.colorize(), timestamp(), myFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
