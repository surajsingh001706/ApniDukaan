const express =require("express");
const Order =require("../models/Order");
const {protect}=require("../middleware/authmiddleware");

const router =express.Router();

// GET /api/orders/my-orders
// details of all the orders
//access private

router.get("/my-orders",protect,async(req,res)=>{
    try {
        const orders =await Order.find({user:req.user._id}).sort({
            createdAt:-1,
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
});

//get /api/orders/:id
//get teh details by id
//@access Private

router.get("/:id",protect,async(req,res)=>{
     try {
        const order =await Order.findById(req.params.id)
        .populate("user","name email");
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})


module.exports =router;
