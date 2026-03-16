// is feature ko redis me banana hai taki hum isko easily manage kar sakein

const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,  
    }
},{
    timestamps:true
})

const blacklistModel= mongoose.model('blacklist',blacklistSchema)

module.exports=blacklistModel