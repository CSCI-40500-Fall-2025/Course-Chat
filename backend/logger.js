import winston from "winston";
const { combine, timestamp, printf } = winston.format;
import WinstonCloudwatch from "winston-cloudwatch";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const cwLogs = new AWS.CloudWatchLogs();

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

const cw = new WinstonCloudwatch({
  logGroupName: "Course-Chat",
  logStreamName: `Course-Chat-Winston-Logging`,
  awsOptions: cwLogs,
  awsRegion: process.env.AWS_REGION,
  jsonMessage: false,
  uploadRate: 2000,
});

process.on("beforeExit", () => {
  logger.end && logger.end();
});

logger.add(cw);

export default logger;
