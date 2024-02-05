const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const Student = require('./models/studentModel'); // Import your Mongoose model

const db = process.env.DATABASE.replace('<password>',process.env.DB_PASSWORD);
mongoose.connect(db);

const stream = fs.createReadStream(`${__dirname}/stDataUpdated17_10_23.csv`)
    .pipe(csv({ separator: ',' }));

stream.on('data', async (row) => {
    const dobWithoutHyphens = row.DOB.replace(/-/g, '');
    console.log(row.DOB,dobWithoutHyphens);
    const hashedDob = await bcrypt.hash(dobWithoutHyphens, 10);

    const studentData = {
        roll: parseInt(row.Roll),
        name: row.Name,
        hashedDob: hashedDob,
        imageId: row.ImageID
    };

    //console.log(JSON.stringify(studentData));
    const student = new Student(studentData);
    student.save()
        .then(() => console.log(`Added student with roll number ${studentData.roll} to the database`))
        .catch((error) => console.error(`Error adding student: ${error.message}`));
});