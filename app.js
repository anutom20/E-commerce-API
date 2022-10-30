require('dotenv').config()
require('express-async-errors')
const cookieParser = require('cookie-parser')

const cors = require('cors');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDBSession = require('connect-mongodb-session')(session)



const port = process.env.PORT || 3001

// route controllers
const authRouter = require('./routes/auth')
const productRouter = require('./routes/products')
const userRouter = require('./routes/users')

// middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const NotFoundMiddleware = require('./middleware/NotFoundMiddleware')




// body parser

app.use(express.json())

// cookie parser

app.use(cookieParser())

// enable all CORS requests

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));



const store = new mongoDBSession({
  uri : process.env.MONGO_URI,
  collection: "mySessions"
})


// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store:store,
  cookie: {maxAge: parseInt(process.env.MAX_AGE)},
  rolling:true
  
}))

const setClientCookie = (req,res,next)=>{
  if(req.session.userId){
    res.cookie("username", req.session.name , {
      maxAge: parseInt(process.env.MAX_AGE),
      httpOnly: false,
      secure: false,
      overwrite: true,
    });
  }
  next()
}

app.use(setClientCookie)


app.get('/', (req, res) => {
  res.json({message : "Hello world"})
})


// routes

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)





// app.get('/api/v1/test' , async (req, res) => {
//   throw Error("access denied")
// });
 
// app.use((err, req, res, next) => {
  
//   res.status(403).json({error : err.message})
  
 
//   next(err);
// });
app.use(errorHandlerMiddleware)
app.use(NotFoundMiddleware)


const start = async()=>{
 try{
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
  })
  app.listen(port, () => {
  
    console.log(`Server listening on port ${port}`)
  })
 }
 catch(error){
  console.log(error)
 } 

}

start()




