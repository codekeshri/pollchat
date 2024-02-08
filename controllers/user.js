const User = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

function isStringValid(str){
    if(str==undefined || str.length===0)return true;
    else return false;
}

const signup = async(req, res, next)=>{
    try {
        const { name, email, password } = req.body;
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
          if (err) throw new Error("Something wrong while hashing password");
          else {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
              res.status(400).send("Email already registered");
            } else {
              const newUser = await User.create({ name, email, password: hash });
              //res.redirect("/");
              res.status(201).json({message: 'Signup succesful'});
            }
          }
        });
      } catch (err) {
        console.error("Signup failed", err);
        res.status(500).send("Signup failed" + err);
      }
}



function generateAccessToken(id, name, ispremiumuser){
    const token =  jwt.sign({userId:id, name:name, ispremiumuser:ispremiumuser}, 'secretKey');
    return token;
  }
  



const signin = async (req, res) => {
    console.log("Signin Data from client to server", req.body);
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ where: { email } }); //if i  do findall it return array and i will have to use user[0]
      if (existingUser) {
        //convert password to hash and compare
        bcrypt.compare(password, existingUser.password, async (err, result) => {
          if (err)
            throw new Error("Trouble matching input password and stored hash");
          else {
            if (result === true){
              console.log("User Login Successful!");
              const token = generateAccessToken(existingUser.id, existingUser.name, existingUser.ispremiumuser);
              const userId = jwt.decode(token).userId;
              const name = jwt.decode(token).name;
              return res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(existingUser.id, existingUser.name, existingUser.ispremiumuser), userId, name});
            }
            else res.status(400).send("Incorrect Password");
          }
        });
      } else res.status(404).send("User not found");
    } catch (err) {
      console.error("Signin failed", err);
      res.status(500).send("Signin failed" + err);
    }
  }


module.exports = {
    signup,
    signin,
    generateAccessToken
}






































// router.get("/", (req, res) => {
//   const htmlPath = path.join(__dirname, "..", "views", "index.html");
//   res.sendFile(htmlPath);
// });



// router.post("/signup", async (req, res) => {
//   console.log("Signup Data from client to server", req.body);
//   try {
//     const { name, email, password } = req.body;
//     const saltrounds = 10;
//     bcrypt.hash(password, saltrounds, async (err, hash) => {
//       if (err) throw new Error("Something wrong while hashing password");
//       else {
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//           res.status(400).send("Email already registered");
//         } else {
//           const newUser = await User.create({ name, email, password: hash });
//           //res.redirect("/");
//           res.status(201).json({message: 'Signup succesful'});
//         }
//       }
//     });
//   } catch (err) {
//     console.error("Signup failed", err);
//     res.status(500).send("Signup failed" + err);
//   }
// });




// router.post("/signin", async (req, res) => {
//   console.log("Signin Data from client to server", req.body);
//   try {
//     const { email, password } = req.body;
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       //convert password to hash and compare
//       bcrypt.compare(password, existingUser.password, async (err, result) => {
//         if (err)
//           throw new Error("Trouble matching input password and stored hash");
//         else {
//           if (result === true){
//             console.log("User Login Successful!");
//             res.status(200).json({success: true, message: "User logged in successfully", user: existingUser});
//           }
//           else res.status(400).send("Incorrect Password");
//         }
//       });
//     } else res.status(404).send("User not found");
//   } catch (err) {
//     console.error("Signin failed", err);
//     res.status(500).send("Signin failed" + err);
//   }
// });


// function generateToken(id, name, secretKey){
//   const token =  jwt.sign({userid:id, username:name}, secretKey);
//   return token;
// }

// module.exports = router;
