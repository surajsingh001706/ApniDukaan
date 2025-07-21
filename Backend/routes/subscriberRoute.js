const express =require("express");
const Subscriber =require("../models/Subscriber");

const router =express.Router();

// Post/api/subscribe
//Handle newsletter subscription
// access public

router.post("/",async(req,res)=>{
    const {email}=req.body;
    if(!email)return res.status(400).send("Email is required");
    try {
        let subscriber =await Subscriber.findOne({email});
        if(subscriber)return res.status(400).json({message:"Already Subscribed"}); 

        subscriber =new Subscriber({email});
        await subscriber.save();
        res.status(201).json({message:"Successfully subscribed to the newsletter!"})
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});
module.exports =router;

