const mongoose = require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('DB is connected')
    }catch(err){
        console.log('error in db connection .')
    }
    
}

module.exports=connectDB