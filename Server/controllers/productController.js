const product = require('../models/productModel');

const getProducts = async (req,res)=>{
    try{
        const products = await product.find({});
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
};

module.exports = {
    getProducts
};