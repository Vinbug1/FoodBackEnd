const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    description: {
        type: 'string',
        required: true
    },
    latitude: {
        type: 'string',
        required: true
    },
    longitude: {
        type: 'string', 
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

addressSchema.method('toJSON', function(){
    const {__v, ...object } = this.toObject();
    const {_id:id, ...result } = object;
    return{ ...result, id};
});

exports.Address = mongoose.model('Address',addressSchema);