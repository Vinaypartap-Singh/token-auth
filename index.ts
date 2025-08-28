import cookieParser from "cookie-parser";
import express, { urlencoded, type Application } from "express";
import RouteHandler from "./src/routes";

const app: Application = express();
const PORT = process.env.PORT || 8080;

// middleware

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// routes middlware
app.use(RouteHandler);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is up & running" });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
