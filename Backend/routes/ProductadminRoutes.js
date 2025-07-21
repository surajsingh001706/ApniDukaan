const express =require("express");
const Product =require("../models/product");
const {protect,admin} =require("../middleware/authmiddleware");

const router =express.Router();

// get/api/admin/products
//all the product
//access admin
router.get("/",protect,admin,async(req,res)=>{
   try {
    const product =await Product.find({});
    res.json(product);

   } catch (error) {
    console.error(error);
    res.status(500).json({message:"Server Error"});
   } 
});
// DELETE /api/admin/products/:id
// delete a product
// access: admin only
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports =router;