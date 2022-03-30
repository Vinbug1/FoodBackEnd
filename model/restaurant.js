const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type:String,
        required: true,        
    },
    food:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
    }],
    rating:{
        type:Number,
        default: 0,
    },
    contact:{
        type: String,
        default: 0,
    },
    address:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref:'Address',
        type: String,
        required: true,
    }
});

restaurantSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

exports.Restaurant = mongoose.model('Restaurant', restaurantSchema);