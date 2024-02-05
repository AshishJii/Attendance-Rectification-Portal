const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    roll: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    hashedDob: {
        type: String,
        required: true
    }
},{ 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    id : false 
});


studentSchema.virtual('imageLink').get(function () {
    return `https://erp.psit.ac.in/assets/img/Simages/${this.imageId}.jpg`;
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
