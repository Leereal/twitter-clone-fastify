import pino from "pino";
import moment from "moment";

export const logger = pino({
  redact: ["hostname"],
  timestamp: () => `,"timestamp":"${moment().format("YYYY-MM-DD HH:mm:ss")}"`,
});
