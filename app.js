import express from 'express';
const app = express();

import routes from "./routes/index.routes.js"
import connectdb from './utils/db.init.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import cors from 'cors';

import path from "path";
import { fileURLToPath } from 'url';


//cors
app.use(cors())

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// parsing
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

//routing
app.use("/", routes)

// 404 not found error
app.use( (req, res, next) => {
  next({
    result: null,
    status: 404,
    msg: "resource not found"
  })
})

//error handling middleware
app.use(errorMiddleware)

// getting port number from .env 
const port = process.env.PORT;

//connect databse before listening to port
connectdb().then( () => {
  app.listen(port, (err) => {
    if(err){
      console.log("Error listening to server ", err);
    } else{
      console.log("Listening to port",port);
    }
  })
})
