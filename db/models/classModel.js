const mongoose = require('mongoose')
const Schema = mongoose.Schema
const classSchema = new Schema({
    studentId: String,
    classDay1: String,
    classDay2: String,
    checkIn:[{
        year: String,
        month: String,
        note: [{
            day: String,
            text: String
        }],
        days: [{
            makeUp: Boolean,
            makeUpDay: String,
            actualDay: String, // 實際應該上課的日子
            time: String
        }]
    }]
},{
    versionKey: false
});

module.exports = mongoose.model('Class', classSchema);