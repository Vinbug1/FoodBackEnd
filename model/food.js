const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ''
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    rating:{
     type: Number,
     default: 0,        
    },
    price:{
        type: Number,
        default: 0.0,
    },
    // isFeatured: {
    //     type: Boolean,
    //     default: false,
    // }
})

foodSchema.method('toJSON', function(){
    const{__v, ...object} = this.toObject();
    const{_id:id, ...result } = object;
    return{ ...result, id};
});

 exports.Food = mongoose.model('Food', foodSchema);