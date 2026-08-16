import "dotenv/config";
import express,{Request, Response} from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { envConfig } from "./config/env.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { connectDatabase } from "./config/database.config";

import passport from "./config/passport.config";
import routes from "./routes";
import webhookRouter from "./routes/webhook.route";

const app = express();

app.use("/api/webhook", webhookRouter);

app.use(cors({ 
  origin: (origin, callback) => {
    // Dynamically reflect requesting origin to allow credentialed requests from Vercel & localhost
    return callback(null, true);
  }, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize())

app.get("/health", asyncHandler(
  async(_req, res) => {
  res.status(HTTPSTATUS.OK).json({
    message: "Server is running",
    status: "healthy",
  });
}))

app.use("/api/v1", routes);
app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  const webPath = path.resolve(__dirname, "../../web/dist");
  const clientPath = path.resolve(__dirname, "../../client/dist");
  const activePath = require("fs").existsSync(webPath) ? webPath : clientPath;

  if (require("fs").existsSync(activePath)) {
    app.use(express.static(activePath));
    app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
      res.sendFile(path.join(activePath, "index.html"));
    });
  } else {
    app.get("/", (_req: Request, res: Response) => {
      res.status(HTTPSTATUS.OK).json({
        message: "CartMind API is online & healthy!",
        environment: process.env.NODE_ENV || "production",
      });
    });
  }
}

app.use(errorHandler);

import { ensureAdminExists } from "./seeds/admin.seed";

const port: number = Number(process.env.PORT) || 10000;

app.listen(port, "0.0.0.0", async () => {
  console.log(`Server listening on 0.0.0.0:${port}`);
  await connectDatabase();
  await ensureAdminExists();
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || "development"} mode`);
});
