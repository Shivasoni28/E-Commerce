const Product = require('../models/productModel');

const getProducts = async (req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
};

const getProductById = async (req,res)=>{
    const id = req.params.id;
    try{
        const product =await Product.findById(id);
        if(product){
            res.status(200).json(product);
        }
        else{
            res.status(404).json({message: "Product not found"});
        }
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    getProducts,
    getProductById
};