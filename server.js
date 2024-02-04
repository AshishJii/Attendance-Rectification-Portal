const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

const port = 4001;
app.listen(port, ()=>{
    console.log("API Server started at port: ",port);
})