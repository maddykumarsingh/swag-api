import mysql from "mysql";

export const connection = mysql.createConnection({
  host: "156.67.214.219",
  user: "iammrmad",
  password: "Maddy@123",
  database: "swagkari",
  insecureAuth: true,
});



