const mongoose = require('mongoose');


//schema
const orderItemSchema = mongoose.Schema({
    quantity:{
        type: Number,
        required: true
    },

    foods:[{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Food' 
    }]   
})
exports.OrderItem = mongoose.model('OrderItem',orderItemSchema);