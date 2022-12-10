const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register",async(req,res)=>{
   try{ 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    
    //creating new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password : hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);}
    catch(err){
        res.status(500).json(err);
    }
}
);

//Login
router.post("/login",async(req,res)=>{
    try {
        const {username,password} = req.body;
        if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
        const user = await User.findOne({username: req.body.username});
        if (!user) return res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(password,user.password);
        !validPassword && res.status(400).json("wrong password")
        res.status(200).json(user)
        
    } catch (error) {
        res.status(500).json(error)
    }
});

module.exports = router;