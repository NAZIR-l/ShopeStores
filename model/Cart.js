const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    totalquantity: {
        type: Number,
        required: true
    },
    totalprice: {
        type: Number,
        required: true
    },
    selectedProduct:{
        required: true,
        type:Array,
    },
});

module.exports = mongoose.model('cart', cartSchema);
