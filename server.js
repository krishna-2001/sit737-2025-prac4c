const express = require("express");
const { error } = require("console");
const winston = require("winston");

const app = express();
const port = 3000;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Calculator Microservice! Use /add, /subtract, /multiply, or /divide with query parameters."
  );
});

app.use(express.json());

const calculate = (operation, num1, num2) => {
  switch (operation) {
    case "add":
      return num1 + num2;
    case "subtract":
      return num1 - num2;
    case "multiply":
      return num1 * num2;
    case "divide":
      return num2 !== 0 ? num1 / num2 : "Error: Division by zero";
    case "power":
      return Math.pow(num1, num2);
    case "sqrt":
      return num1 >= 0
        ? Math.sqrt(num1)
        : "Error: Negative number for square root";
    case "mod":
      return num2 !== 0 ? num1 % num2 : "Error modulo by zero";
    default:
      return "invalid Operation";
  }
};
app.get("/sqrt", (req, res) => {
  const num1 = parseFloat(req.query.num1);

  if (isNaN(num1)) {
    logger.error(`Invalid input for sqrt: num1=${req.query.num1}`);
    return res.status(400).json({ error: "Invalid number provided" });
  }

  const result = calculate("sqrt", num1);
  logger.info(`Operation: sqrt, num1: ${num1}, result: ${result}`);
  res.json({ operation: "sqrt", result });
});

["add", "subtract", "multiply", "divide", "power", "mod"].forEach((op) => {
  app.get(`/${op}`, (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if (isNaN(num1) || isNaN(num2)) {
      logger.error(
        `Invalid input: num1=${req.query.num1}, num2=&{req.query.num2}`
      );
      return res.status(400).json({ error: "invalid numbers provided" });
    }

    const result = calculate(op, num1, num2);
    logger.info(
      `operation: &{op},num1: &{num1}, num2: &{num2}, result: ${result}`
    );
    res.json({ operation: op, result });
  });
});

app.get("/sqrt", (req, res) => {
  const num1 = parseFloat(req.query.num1);

  if (isNaN(num1)) {
    logger.error(`Invalid input for square root: num1=${req.query.num1}`);
    return res.status(400).json({ error: "Invalid number provided" });
  }

  const result = calculate("sqrt", num1);
  logger.info(`Operation: sqrt, num1: &{num1}, result: ${result}`);
  res.json({ operation: "sqrt", result });
});

app.listen(port, () => {
  logger.info(`calculator microservice running on http://localhost:&{port}`);
});
