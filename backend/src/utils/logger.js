import colors from "colors";

const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message) => {
    console.log(`${getTimestamp().gray} [${"INFO".blue}] ${message}`);
  },
  warn: (message) => {
    console.warn(`${getTimestamp().gray} [${"WARN".yellow}] ${message}`);
  },
  error: (message) => {
    console.error(`${getTimestamp().gray} [${"ERROR".red}] ${message}`);
  },
  http: (message) => {
    console.log(`${getTimestamp().gray} [${"HTTP".magenta}] ${message}`);
  }
};
