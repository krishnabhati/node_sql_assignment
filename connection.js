const mysql = require("mysql")

var myconn = mysql.createConnection ({
    host: "localhost",
    user : "root",
    password : "",
    database:"users"
})

myconn.connect((err)=>{
    if(!err){
        console.log("Database Connection is successfull")
    }
    else{
        console.log("Database Connection Failed")
    }
})
module.exports = myconn;