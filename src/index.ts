import "dotenv/config";
import express from "express";
import routes from "./routes/routes";
const app = express();

app.use("/api/v1", routes);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
