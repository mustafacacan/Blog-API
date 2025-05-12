const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const routes = require("./routes");
const loggerMiddleware = require("./middleware/log/logger");

require("dotenv").config();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(loggerMiddleware);
app.use("/api", routes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`server is running ${process.env.PORT}' port`);
});
