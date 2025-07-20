const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    ,
    items:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
            ,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
        }
    ],
    totalAmount:{
        type: Number,
        required: true
    },
    status: {
        type:String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    paymentMethod :{
        type: String,
        enum : ["cod", "online"],
        default: "cod",
    },

},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema);