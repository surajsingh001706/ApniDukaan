const express =require("express");
const Order =require("../models/Order");
const {protect,admin} =require("../middleware/authmiddleware");

const router =express.Router();

// get/api/admin/orders
//acccess all the orders
//admin only

router.get("/",protect,admin,async(req,res)=>{
    try {
        const order =await Order.find({}).populate("user", "name email");
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

//Put /api/admin/orders/:id
//update the orders
//admin only

router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const order =await Order.findById(req.params.id).populate("user","name");
        if(!order)return res.status(404).json({message:"Order not exist"});

        order.status =req.body.status || order.status;
        order.isDelivered =req.body.status==="Delivered"?true: false;
        order.deliveredAt =req.body.status ==="Delivered"? Date.now() :"";
        
        await order.save();
        res.status(201).json({message:"Order updated successfully",order})

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

//delete /api/admin/orders/:id
//delete the orders
//admin only


router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        let order =await Order.findById(req.params.id);
        if(!order)return res.status(404).json({message:"Order not exist"});
        await order.deleteOne();
        res.status(201).json({message:"Order deleted successfully"});
    } catch (error) {
         console.log(error);
        res.status(500).send("Server Error");
    }
});


module.exports =router;