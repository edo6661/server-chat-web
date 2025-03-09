import serverless from "serverless-http";
import { app } from "../../lib/socket";

export const handler = serverless(app);
