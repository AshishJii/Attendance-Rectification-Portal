const mongoose = require('mongoose');
const moment = require('moment');

const rectifSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
        //unique: true
    },
    rawDate: {
        type: Date,
        required: true
    },
    periodsArr: [{
        no: {
            type: Number,
            required: true
        },
        faculty: {
            type: String,
            required: true
        }
    }]
},{ 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    id : false 
});

rectifSchema.virtual('date').get(function () {
    return moment(this.rawDate).format('DD-MM-YYYY');
});

const Rectif = mongoose.model('Rectification', rectifSchema);
module.exports = Rectif;