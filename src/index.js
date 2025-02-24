const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const collection = require("./config");

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
//To link any other styling files from a folder
app.use(express.static("public"));

//Render the pages
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

//Register new user
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  //check if user already exists
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res
      .status(400)
      .send(
        '<script>alert("User exists, please enter another username"); window.location.href = "/signup";</script>'
      );
  } else {
    //hash the password using bcrypt 
    const saltRounds = 10;
    const hashPassword = await  bcrypt.hash(data.password, saltRounds);
    //replace the  password with the hashed password
    data.password = hashPassword;

    //inserting data to the database using "insertMany"
    const userdata = await collection.insertMany(data);
    console.log(userdata);//just to check the data you can remove it
    res.redirect('/login')
  }
});

//login the user
app.post('/login', async (req,res)=>{
    try{
        const check = await collection.findOne({name:req.body.username});
        if(!check){
            res.send('<script>alert("No user exists!!"); window.location.href = "/login";</script>');
            //if user not exist the page will give an alert and redirect to login page
            return;
        }
        //compare the hash password
        const isPassword = await bcrypt.compare(req.body.password, check.password);
        
        if(isPassword){
            res.render('home');
        }else{
            res.send('<script>alert("Incorrect Name or Password!! "); window.location.href = "/login";</script>')
        }
    }catch{
        res.send("Wrong details!")
    }
})
app.listen(9000, () => {
  console.log("Server started on port 9000");
});
