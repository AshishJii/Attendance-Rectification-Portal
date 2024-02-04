const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const app = express();
//top level code
const students = JSON.parse(fs.readFileSync(`${__dirname}/assets/students.json`));
//console.log(students);
const rectifs = JSON.parse(fs.readFileSync(`${__dirname}/assets/rectifications.json`));

//TOdo
//create a roll check function
//Remove the  id property from Students.json

//For students
//getting verification data

app.use(express.json());
app.use(morgan('dev'));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
   // res.header('Access-Control-Allow-Origin', 'http://192.168.137.1:3333');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(`${__dirname}/public`));


app.get('/api/students/:roll', (req, res) => {

    if(req.params.roll in students){
        const stdata = students[req.params.roll];
        return res.status(200).json({
            status: "success",
            data: {stdata}
        });
    }

    res.status(404).json({
            status: "fail",
            message: "Student ID not found"
        });
});

//posting rectification request
app.post('/api/rectifications', (req, res) => {
    const newRectif = req.body;
    rectifs.push(newRectif);
    fs.writeFile(`${__dirname}/assets/rectifications.json`, JSON.stringify(rectifs), ()=>{
        res.status(201).send();
    })
});


//For faculty
//getting rectification records
app.get('/api/rectifications', (req,res) => {
    const fData =  rectifs.map(obj => ({
        ...students[obj.roll],
        ...obj,
        
    }));
    res.status(200).json(fData);
});

//deleting rectifications
app.delete('/api/rectifications/:roll', (req,res) => {
    const roll = req.params.roll;
    //Replace this line : Store the array of rectified attendences
    const indicesToRemove = rectifs.reduce((indices, obj, idx) => {
        if (obj.roll == roll) {
          indices.push(idx);
        }
        return indices;
      }, []);
      

    for(let i = indicesToRemove.length - 1; i >= 0; i--) {
        rectifs.splice(indicesToRemove[i], 1);
    }

    fs.writeFile(`${__dirname}/assets/rectifications.json`, JSON.stringify(rectifs), ()=>{
        res.status(204).send();
    })
});

module.exports = app;





//  JSend objects

//Students
//Getting inforamtion(on verify button click)       GET
let v = 
{
    status: "success",
    data: {
        name: "Bhupendra Jogi",
        branch: "CS AI",
        image: "https://erp.psit.ac.in/assets/img/Simages/2213048.jpg"
    }
}

//Sending/Storing data(submit button)              POST

v =
{
    roll : 2201640100092,
    daysArr: [
        {
            date: "2023-11-11",
            periods: 2,
            periodsArr: [
                {
                    no: 5,
                    faculty: "Amitabh Bachchan"
                },
                {
                    no: 6,
                    faculty: "Amitabh Bachchan"
                }
            ]
        },
        {
            date: "2023-11-15",
            periods: 3,
            periodsArr: [
                {
                    no: 1,
                    faculty: "Stephan Hawking"
                },
                {
                    no: 5,
                    faculty: "Jay Shah"
                },
                {
                    no: 6,
                    faculty: "Moon"
                }
            ]
        }
    ]
}

//console.log(JSON.stringify(v));