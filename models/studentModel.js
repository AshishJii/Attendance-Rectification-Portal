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

studentSchema.virtual('branch').get(function(){
    const branchCode = this.roll.toString().substring(6,9);
    const mappings = {
        '010': 'CSE',
        '169': 'CSE',
        '153': 'CS-AIML',
        '164': 'AIML',
        '163': 'AIDS',
        '152': 'CS-AI',
        '013': 'IT',
        '031': 'EC',
        '154': 'CS-DS',
        '155': 'CS-IOT',
        '172': 'CS-CYS'
      };
    return mappings[branchCode] || 'Unknown Branch';
})

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
