const mongoose = require('mongoose')
const Schema = mongoose.Schema
const classBreakSchema = new Schema({
    teacherId: String,
    break:[
        {
            year: String,
            month: String,
            day: [String]
        }
    ]
},{
    versionKey: false
});

module.exports = mongoose.model('ClassBreak', classBreakSchema);