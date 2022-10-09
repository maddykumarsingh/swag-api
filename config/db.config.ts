import mysql from "mysql";

const connection = mysql.createConnection({
  host: "156.67.214.219",
  user: "iammrmad",
  password: "Maddy@123",
  database: "swagkari",
  insecureAuth: true,
});

const connector = connection.connect((err:any) => {
    if(err){
        throw err;
    }
    else{
        console.log('Connected to Database Successfully......!!');
    }
})

module.exports = connection