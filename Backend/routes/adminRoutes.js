const express =require("express");
const {protect,admin} = require("../middleware/authmiddleware");
const User =require("../models/user");

const router =express.Router();

//get /api/admin/users
// saare users mil jayenge use only by the admin

router.get("/",protect,admin,async(req,res)=>{
    try {
        const users =await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

//Post /api/admin/users
// add a new user
//admin access

router.post("/",protect,admin,async(req,res)=>{
    const {name,email,password,role}=req.body;
    try {
        let user =await User.findOne({email});
        if(user)return res.status(400).json({message:"Already a user exist with this email"});

        user =new User({
            name,
            email,
            password,
            role :role ||"customer",
        });
        await user.save();
        res.status(200).json({message:"New user added successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// Put /api/admin/users/:id
//update information
//only by admin

router.put("/:id",protect,admin,async(req,res)=>{
    try {
        let user =await User.findById(req.params.id);
        if(!user)return res.status(404).json({message:"User not exist"});
        user.name =req.body.name || user.name;
        user.email=req.body.email || user.email;
        user.role=req.body.role || user.role;
        await user.save();
        res.status(201).json({message:"User updated successfully",user});
    } catch (error) {
         console.log(error);
        res.status(500).send("Server Error");
    }
});

// delete /api/admin/users/:id
//delete the user
//only by admin

router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        let user =await User.findById(req.params.id);
        if(!user)return res.status(404).json({message:"User not exist"});
        await user.deleteOne();
        res.status(201).json({message:"User details deleted successfully"});
    } catch (error) {
         console.log(error);
        res.status(500).send("Server Error");
    }
});


module.exports =router;