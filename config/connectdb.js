import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql";

const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;

const connectDb = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: "url_shortener_db",
  insecureAuth: true,
});

connectDb.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

export default connectDb;
