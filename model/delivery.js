const  mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
    to:{
        type: 'string',
        required: true
    },
    From: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    startTime:{
        type: String,
        required: true,
    },
    endTime:{
        type: String,
        required: true,
    },
    agent: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

deliverySchema.method('toJSON', function(){
    const {__v, ...object } = this.toObject();
    const {_id:id, ...result } = object;
    return{ ...result, id};
});

exports.Delivery = mongoose.model('Delivery',deliverySchema);