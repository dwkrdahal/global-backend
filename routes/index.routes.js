import express from "express";
const app = express();

// routes
import homeRoutes from "./home.routes.js"
import authRoutes from "./auth.routes.js"
import projectRoutes from "./project.routes.js"
import userRoutes from "./user.routes.js"
import messageRoutes from "./message.routes.js"
import userPreferenceRoutes from "./user-preference.routes.js"
import teamRoutes from "./team.routes.js"
import serviceRoutes from "./service.routes.js"

app.use("/", homeRoutes)
app.use("/auth", authRoutes)
app.use("/project", projectRoutes)
app.use("/user", userRoutes)
app.use("/message", messageRoutes)
app.use("/preference", userPreferenceRoutes)
app.use("/team", teamRoutes)
app.use("/service",serviceRoutes)

export default app;