const mongoose = require('mongoose');


//schema
const foodItemSchema = mongoose.Schema({
    // quantity:{
    //     type: Number,
    //     required: true
    // },

    foods:[{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Food' 
    }]   
})
exports.FoodItem = mongoose.model('FoodItem',foodItemSchema);