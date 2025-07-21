const express = require("express");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authmiddleware");
const Product = require("../models/product");

const router = express.Router();


// Helper function

const getCart = async (userId, guestId) => {
  // Prefer user cart if logged in
  let cart = null;
  if (userId) {
    cart = await Cart.findOne({ user: userId });
    if (cart) return cart;
  }
  if (guestId) {
    cart = await Cart.findOne({ guestId });
    if (cart) return cart;
  }
  return null;
};


// POST /api/cart
// Add a product to the cart for the user or guest
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "No Product Found" });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: product.price,
                    size,
                    color,
                    quantity: quantity,
                });
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            
            const newCart = await Cart.create({
                user: userId || undefined,
                guestId: guestId || `guest_${Date.now()}`,
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images?.[0]?.url || "",
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice:product.price*quantity,
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// put/api/cart
//update product quantity
//acces public

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  if (!productId || !size || !color) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "No cart available" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId.toString() &&
        p.size === size &&
        p.color === color
    );

   

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// DELETE /api/cart
// Remove a product from the cart
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  if (!productId || !size || !color) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "No cart available" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId.toString() &&
        p.size === size &&
        p.color === color
    );


    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error( error);
    res.status(500).json({ message: "Server Error" });
  }
});


// get/api/cart
/* get logged in and get user cart */
//access public

router.get("/", async(req,res)=>{
    const {  userId, guestId } = req.query;
    
    try {
       const cart =await getCart(userId,guestId);
       if(cart){
        res.json(cart);
       }
       else{
        res.status(404).json({message:"Cart not found"});
       }
    } catch (error) {
        console.error(error);
       res.status(500).json({message:"Server Error"});
    }

});

// post/api/cart/merge
// guest user cart ko login krwana
// access/private

router.post("/merge",protect,async(req,res)=>{
    const {guestId}=req.body;

    try {
       const guestCart =await Cart.findOne({guestId}); 
       const userCart =await Cart.findOne({user:req.user._id}); 

       if(guestCart){
        if(guestCart.products.length === 0){
            return res.status(400).json({message:"Guest cart is empty"});
        }
        if(userCart){
            guestCart.products.forEach((item)=>{
                const productIndex =userCart.products.findIndex((p)=>
                p.productId.toString() === item.productId.toString() && p.size === item.size && p.color === item.color );

                if(productIndex>-1){
                    userCart.products[productIndex].quantity+=item.quantity;
                }
                else{
                    userCart.products.push(item);
                }
            });
            userCart.totalPrice = userCart.products.reduce((acc,item)=>acc + item.price*item.quantity,0);
            await userCart.save();
            try {
                await Cart.findOneAndDelete({guestId});
            } catch (error) {
                console.error("Deleting guest cart");
            }
            res.status(200).json(userCart);
        }
        else{
            guestCart.user =req.user._id;
            guestCart.guestId =undefined;
            await guestCart.save();
            res.status(200).json(guestCart);
        }
       }
       else{
        if(userCart){
            return res.status(200).json(userCart);
        }
        res.status(404).json({message:"No Cart Found"});
       }

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
})


module.exports = router;
