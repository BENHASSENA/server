const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    nameTask:{
        type:String,
        required:true
    },
    priorityTask:{
        type:String,
    },
    timeEstimateTask:{
        type:String,
    },
    timeRealTask:{
        type:String,
    },
    echeanceTask:{
        type:String,
    },
    rappelTask:{
        type:String,
    },
    folderId:{
        type:String,
    }

})

module.exports = mongoose.model( 'Task', taskSchema)

