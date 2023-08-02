const express = require("express");
const { sequelize } = require("./src/models");
const { rootRouter } = require("./src/routers");
const { QueryTypes } = require("sequelize");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const PORT = 3005;
const app = express();
const cors = require("cors");

app.use(cookieParser());
app.use(cors());

//đọc được json
app.use(express.json());
//cài static file
app.use(express.static(path.join(__dirname, "public")));
//đọc được array, object
app.use(express.urlencoded({ extended: true }));

//call route
app.use(rootRouter);

const listener = app.listen(PORT, async () => {
  console.log(`App listening on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Kết nối thành công!.");
  } catch (error) {
    console.error("Kết nối thất bại:", error);
  }
});
