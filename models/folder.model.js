const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    nameFolder:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model( 'Folder', folderSchema)

