const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 7899;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running at port no : ${PORT}`);
  });
})();
