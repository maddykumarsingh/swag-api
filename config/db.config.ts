import mysql from "mysql";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "peoplesPerson",
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

module.exports = connector