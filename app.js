require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const mongoose = require('mongoose')


const port = process.env.PORT || 3000 

// route controllers
const authRouter = require('./routes/auth')
const productRouter = require('./routes/products')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/users')

// middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const NotFoundMiddleware = require('./middleware/NotFoundMiddleware')

// body parser

app.use(express.json())




app.get('/', (req, res) => {
  res.send('Hello World!')
})


// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/cart', cartRouter)
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




