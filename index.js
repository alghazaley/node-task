require('dotenv').config()
const express =require('express') 
const cors=require('cors')
const cookieSession =require('cookie-session') 
require('express-async-errors')


const mongoose =require('mongoose') 
//Auth
const { signup } =require('./routes/signup') 
const { signin } =require('./routes/signin') 
const { signout } =require('./routes/signout') 
const { current } =require('./routes/current-user') 

const { handelerr } =require('./middlewares/handelError') 
const {notfound}=require('./errorclasses/notfound')
const {BadReqErr}=require('./errorclasses/badReq')


const app=express()
const port=process.env.PORT||9000



app.use(cors())
app.use(express.json())
app.use(express.urlencoded());
//first we make the cookie not encrypted 
//one month the cookie will last 
app.use(
    cookieSession({
        signed:false,
    })
)

//auth
app.use('/api/users',signup)
app.use('/api/users',signin)
app.use('/api/users',signout)
app.use('/api/users',current)



app.all('*',()=>{
    throw new notfound('can not find this page please try again')
})
app.use(handelerr)
const start=async()=>{
  
    if(!process.env.JWT_KEY){
        throw new BadReqErr('Jwt is not defined')
    }
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('connected to db')
    }catch (err){
        console.log(err,'err to connect')
    }

    app.listen(port,()=>{
        console.log(`listening in port ${port}`)
    })
}
start()