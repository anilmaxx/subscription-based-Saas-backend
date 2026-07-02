const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required:true
    },
    features:{
        type: [String],
        default:[]
    },

});



module.exports = mongoose.model('Plan', planSchema)