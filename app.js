const express = require("express");
const sequelize = require("./app/config/db");
const userRoutes = require("./app/routes/userRoutes");
const app = express();

app.use(express.json());
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database and tables created.");
  })
  .catch((error) => {
    console.error("Error creating database and tables:", error);
  });
app.use(userRoutes);
const port = 9000;

app.listen(port, () => {
  console.log(`App is running on PORT: ${port}.`);
});
