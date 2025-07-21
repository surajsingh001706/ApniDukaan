const express =require("express");
const Checkout =require("../models/Checkout");
const Cart =require("../models/Cart");
const Product =require("../models/product");
const Order =require("../models/Order");
const {protect}=require("../middleware/authmiddleware");

// post /api/checkout
//access private

const router =express.Router();

router.post("/",protect,async(req,res)=>{
    const {checkoutItem,shippingAdress,paymentMethod,totalPrice}=req.body;

    if(!checkoutItem || checkoutItem.length == 0){
        return res.status(400).json({message:"No items in checkout"});
    }
    try {
        const newCheckout =await Checkout.create({
            user:req.user._id,
            checkoutItem:checkoutItem,
            shippingAdress,
            paymentMethod,
            totalPrice,
            paymentStatus:"Pending",
            isPaid:false,
        });
        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});


//Put /api/checkout/:id/pay
// update checkout to mark as paid after successful payment
//aceess private

router.put("/:id/pay",protect,async(req,res)=>{
    const {paymentStatus,paymentDetails}=req.body;
    try {
        const checkout =await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Checkout not found"});
        }
        if(paymentStatus === "paid"){
            checkout.isPaid =true;
            checkout.paymentStatus =paymentStatus;
            checkout.paymentDetails =paymentDetails;
            checkout.paidAt=Date.now();
            await checkout.save();
            res.status(200).json(checkout);
        }
        else{
            res.status(200).json({message:"Unpaid"});
        }
    } catch (error) {
         console.error(error);
         res.status(500).json({message:"Server Error"});
    }
});


// post /api/checkout/:id/finalize
//it convert the checkout ko order ke form me jab payment confirm ho jaata hai
// access Private

router.post("/:id/finalize",protect,async(req,res)=>{
    try {
      const checkout =await Checkout.findById(req.params.id);  

      if(!checkout){
        return res.status(404).json({message:"Checkout not found"});
      }
      if(checkout.isPaid && !checkout.isFinalized){
        const finalOrder =await Order.create({
            user:checkout.user,
            orderItem:checkout.checkoutItem,
            shippingAdress:checkout.shippingAdress,
            paymentMethod: checkout.paymentMethod,
            totalPrice:checkout.totalPrice,
            isPaid:true,
            paidAt:checkout.paidAt,
            isDelivered:false,
            paymentStatus:"paid",
            paymentDetails:checkout.paymentDetails
        });
        checkout.isFinalized =true;
        checkout.FinalizedAt =Date.now();
        await checkout.save();

        await Cart.findOneAndDelete({user:checkout.user});
        res.status(201).json(finalOrder);
      }
      else if(checkout.isFinalized){
         res.status(401).json({message:"Already Finalized"});
      }
      else{
        res.status(401).json({message:"Checkout is not paid"});
      }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

module.exports =router;