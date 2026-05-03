const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.testuser = (req , res) =>{
    res.send("controller is working")
}

exports.getprofile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected profile accessed",
    user: req.user
  });
};
exports.register = async(req , res) =>{
   try{
    const {name , email , password} = req.body
    if(!name || !email || !password){
        return res.status(400).json({
            success : false,
            message : "please fill all the fields"
        })
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const haspass = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password : haspass
    })

    res.status(201).json({
        success : true,
        message : "user registered successfully"
    })
   }
   catch(error){
    res.status(500).json({
        success : false,
        message : error.message 
    })
   }
}


exports.login = async (req , res) =>{
    try{
        const {email , password} = req.body

        if(!email || !password){
           return res.status(400).json({
                success : false,
                message : "fill all details"
            })
        }
        const user = await User.findOne({email})
        if(!user){
           return res.status(401).json({
               success : false,
                message : "wrong email or password"  
            })
        }

        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch){
            return res.status(401).json({
               success : false,
                message : "wrong email or password"  
            })
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE}
        );

        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        } ).json({
        success: true,
        message: "Login successful"
        });



    } catch(error){
        res.status(500).json({
      success: false,
      message: error.message
    })
    }
}

exports.logout = (req , res) =>{
    res.status(200).cookie("token" , "" ,{
        httpOnly : true,
        expires : new Date(0)
    }).json({
        success : true,
        message : "logged out successfully"
    })
}

exports.adminboard = (req, res) => {
    res.status(200).json({
        success: true
    });
}

const Product = require("../models/product");

exports.addToCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;
    if (!quantity || quantity <= 0) {
  return res.status(400).json({
    success: false,
    message: "Quantity must be greater than 0"
  });
}

    // Product exists?
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
  return res.status(400).json({
    success: false,
    message: "Not enough stock available"
  });
}

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Current user
    const user = await User.findById(req.user._id);

    // Already in cart?
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Increase quantity
      existingItem.quantity += Number(quantity);

    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity: Number(quantity)
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: user.cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({
      success: true,
      cart: user.cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    cartItem.quantity = Number(quantity);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: user.cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};