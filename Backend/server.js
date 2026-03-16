require('dotenv').config()
const app=require('./src/app')
const connectDB=require('./src/db/db')

connectDB()

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})



// const generateInterviewReport = require('./src/services/ai.service')

// const {resume,selfDescription,jobDescription}= require('./src/services/temp')


// generateInterviewReport({resume,selfDescription,jobDescription})