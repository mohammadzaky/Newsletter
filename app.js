const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); //we should be able to refer to the static files by a relative url, specifies a static folder
app.use(bodyParser.urlencoded({extended:true})); //to use what the user entered into the input, we need to use body-parser

app.get('/', function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post('/',function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:   {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);  //so i can turn the data into a string that is in the format of json, this is what we're gonna send to mailchimp
   
    const url = "https://us21.api.mailchimp.com/3.0/lists/33ade97a9c";

    const options = {
        method: "POST",
        auth:"mohammad1:a3135b6d18c31a016161473b13271f2b2-us21"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){    //process.env.PORT is dynamic port that Heroku will define on the go 
    console.log("Server is running on port 3000");  //with || 3000, our app will work both on heroku as well as our local system
});



//api key
//3135b6d18c31a016161473b13271f2b2-us21

//list id
//33ade97a9c    