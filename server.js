const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');

//handle unhandled exceptions
process.on('uncaughtException', err => {
    console.error(err.name, err.message);
    console.error(err);
    console.log('Uncaught Exception. 💥 Shutting down...');
    process.exit(1);
})

const db = process.env.DATABASE.replace('<password>',process.env.DB_PASSWORD);
const port = process.env.PORT || 4001;
mongoose.connect(db).then(()=>{
    console.log("Database Connected");
    console.log(`Click here to launch▶️: http://127.0.0.1:${port}/request`);
    console.log(`Temporary aggregation display: http://127.0.0.1:${port}`);
}).catch(err=>{
    console.error("Error connecting to MongoDB:", err.message);
})

const app = require('./app');
const server = app.listen(port, ()=>{
    console.log("API Server started at port: ",port);
});

//handle unhandled rejections
process.on('unhandledRejection', err=> {
    console.error(err.name, err.message);
    console.log("Uncaught Rejection. 💥 Shutting down...");
    server.close(()=> {
        process.exit(1);
    })
})