const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Student = require('./models/studentModel');
const Rectif = require('./models/rectifModel');
const catchAsync = require('./utils/catchAsync');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`,{extensions:['html']}));

//For students
//Getting verification data
app.get('/api/students/:roll', catchAsync(async (req, res, next) => {
    const {roll} = req.params;
    const student = await Student.findOne({roll});
    if(student){
        return res.status(200).json({
            status: "success",
            data: { student }
        });
    }

    res.status(404).json({
        status: "fail",
        message: "Student ID not found"
    });
}));

//posting rectification request
app.post('/api/rectifications', catchAsync(async (req, res, next) => {
    const { roll, date, periodsArr } = req.body;
    const student = await Student.findOne({ roll });
    if (!student) {
        return res.status(404).json({
            status: 'fail',
            message: 'Student not found'
        });
    }
    const rectif = await Rectif.create({
        student: student._id,
        rawDate: new Date(date),
        periodsArr: periodsArr
    });

    res.status(201).json({
        status: 'success',
        data: {rectif}
    })
}));

//For faculty
const authenticate = catchAsync(async (req,res, next) => {
    let token = req.cookies.jwtToken;
    console.log('jwt', token);
    if(!token){
        res.status(401).json({
            status: 'fail',
            message: 'not logged in'
        })
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err, verifiedJwt) => {
        if(err){
            res.status(401).json({
                status: 'fail',
                message: 'not logged in'
            });
        } else next();
      });
});

//getting rectification records
app.get('/api/rectifications', authenticate, catchAsync(async (req, res, next) => {
    const rectifs = await Rectif.find().populate('student');
    res.status(200).json({
        status: 'success',
        data: { rectifs }
    })
}));

//deleting rectifications
app.delete('/api/rectifications/:id', authenticate, catchAsync(async (req,res, next) => {
    const {id} = req.params;
    const rectif = await Rectif.findByIdAndDelete(id);
    if(!rectif){
        return res.status(404).json({
            status: "fail",
            message: "Rectification record not found"
        });
    }

    res.status(200).json({
        status: 'success',
        data: null
    })
}));


//Authentications
app.post('/login', catchAsync(async (req, res, next) => {
    const {username, password} = req.body;
    
    if(username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({id: username}, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            res.cookie('jwtToken', token, { httpOnly: true, secure: false });
            
            res.status(200).json({
                status: 'success',
                data: null
            });
        }
    else{
        res.status(401).json({
            success: 'fail',
            message: 'Incorrect Credentials'
        })
    }
}));

module.exports = app;





app.use('/', catchAsync(async (req,res,next) => {
    const grouped = await Rectif.aggregate([
        {
            $unwind: '$periodsArr'
        },
        {
            $group: {
                _id: {
                    faculty: '$periodsArr.faculty',
                    date: { $dateToString: { format: '%d-%m-%Y', date: '$rawDate' } },
                    student: '$student'
                },
                periodsArr: { $push: '$periodsArr.no' }
            }
        },
        {
            $group: {
                _id: {
                    faculty: '$_id.faculty',
                    date: "$_id.date"
                },
                students: {
                    $push: {
                        student: '$_id.student',
                        periodsArr: '$periodsArr'
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id.faculty',
                rectifs: {
                    $push: {
                        date: '$_id.date',
                        students: '$students'
                    }
                }
            }
        }
    ]);
    
    console.log(grouped);
    const jsonData = {
        status: 'success',
        data: grouped
    };
    const htmlContent = generateHTML(jsonData);
    res.send(htmlContent);
    //res.status(201).json()
}))

//error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
})



//  JSend objects
function generateHTML(jsonData) {
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dynamic HTML Response</title>
      </head>
      <body>
        <h1>Status: ${jsonData.status}</h1>
        <ul>
    `;
  
    jsonData.data.forEach(faculty => {
      html += `<li><strong>${faculty._id}</strong>`;
      
      faculty.rectifs.forEach(rectif => {
        html += `<ul>`;
        html += `<li>Date: ${rectif.date}`;
        
        rectif.students.forEach(student => {
          html += `<ul>`;
          html += `<li>Student: ${student.student}</li>`;
          html += `<li>Periods Arr: ${JSON.stringify(student.periodsArr)}</li>`;
          html += `</ul>`;
        });
  
        html += `</li>`;
        html += `</ul>`;
      });
  
      html += `</li>`;
    });
  
    html += `
        </ul>
      </body>
      </html>
    `;
  
    return html;
  }