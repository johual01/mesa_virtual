import app from "./app";
import { startConnection } from "./database";

startConnection();
app.listen(process.env.PORT || 3000);
console.log("Server on port", process.env.PORT || 3000);
