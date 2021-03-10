const express = require('express')
const bodyParser = require('body-parser')
const myconn = require('./connection')
var md5 = require('md5');
const app = express()
var ReverseMd5 = require('reverse-md5')
var jwt = require('jsonwebtoken');
// var passwordHash = require('password-hash');
// var Cryptr = require("cryptr");
// cryptr = new Cryptr("key") 





// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())

// MySQL
app.get('/', (req, res) => {
    res.send('Hello World!')
});

var rev = ReverseMd5({
    lettersUpper: true,
    lettersLower: true,
    numbers: true,
    special: true,
    whitespace: true,
    maxLen: 12
})

app.post("/adduser", (req, res) => {
    //let user = req.body;
    //password encryption
    //let encryptpass = passwordHash.generate(req.body.password);
    //let encryptpass = cryptr.encrypt(req.body.password)
    let encryptpass = md5(req.body.password)
    let user = {
        username: req.body.username,
        password: encryptpass,
        contactNo: req.body.contactno,
    }
    console.log(user, ">>>>>>")
    myconn.query("INSERT INTO user_details SET ? ", user, function (error, results, fields) {
        if (error) throw error;
        return res.send({ status: 200, data: results, message: 'New user has been created successfully.' });
    });
})


app.get("/getallusers", (req, res) => {
    myconn.query("select * from user_details ORDER BY created_time ASC", (err, rows, fields) => {

        // rows[0].password = rev(rows[0].password).str()
        console.log(rows);
        //for(let i=0;i<rows.length;i++){
        //password decryption
        //rows[i].password = cryptr.decrypt(rows[i].password)
        //rows[i].password = rev(rows[i].password)
        //console.log(rows)
        //}

        if (!err) {
            res.send({ status: 200, msg: "get all users successfully", data: rows });
        }
        else {
            console.log(err)
        }
    })
})

//Task 3


app.post('/deleteuser', (req, res) => {
    let userids = req.body.user_id //array of ids
    userids.forEach((s) => myconn.query("DELETE FROM user_details WHERE user_id= ?", [s], (err, rows, fields) => {
    }));
    res.send({ status: 200, msg: "user deleted successfully" });
})



//Task 2
app.post("/login", (req, res) => {
    let username = req.body.username;
    //let password = req.body.password;


    myconn.query("select * from user_details WHERE username =?", username, (err, data, fields) => {

        if (data[0]) {
            console.log("User exists")

            //console.log(rev('7e9d9092af724f318a688e52ba004fa4'))
            if (data[0].password == md5(req.body.password)) {
                console.log("login successfully");
                let payload = {
                    user_id: data[0].user_id,
                    username: data[0].username,
                    mobile: data[0].contactNo,
                    created_time: data[0].created_time
                }
                //console.log(payload, "NEWWWWWWWWWWWW");
                let authToken = jwt.sign(payload, "krishna", { algorithm: "HS256", expiresIn: "180d" });
                res.send({
                    msg: "Login Successfully",
                    status: 200,
                    accessToken: authToken
                })
            } else {
                res.send({
                    msg: "Wrong Credintials",
                    status: 400
                })
            }
        } else {
            res.send({
                msg: "User Not Found",
                status: 404
            })
        }


    })
})

app.listen(8000, () => {
    console.log('listening on port 8000!')
});



/////TASK 4
//SQL Assignment

// 1. Write a SQL statement to find the list of customers who appointed a salesman for their jobs and gets a
// commission from the company for more than 12%.

//ANSWER 

// SELECT *
// FROM customer a
// INNER JOIN salesman b
// ON a.salesman_id=b.salesman_id
// WHERE b.commission>.12; 
