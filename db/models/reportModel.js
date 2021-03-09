const mongoose = require('mongoose')
const Schema = mongoose.Schema
const reportSchema = new Schema({
    studentId: {type: String, index: true },
    enrollYear: Number,
    enrollMonth: Number,
    enrollGrade: String,
    progress: [{
        grade: String,
        year: Number,
        month: Number,
        progress: {
            mathI: String,
            math: String,
            chineseI: String,
            chinese: String,
            englishI: String,
            english: String, 
            ILine: String,
        }
    }],
    analyzeData: [{
        grade: String,
        year: Number,
        month: Number,
        iLine: String,
        progress: {
            math: String,
            chinese: String,
            english: String
        },
        ILine: {
            math: Number,
            chinese: Number,
            english: Number
        },
        predict: {
            after: String,
            math: String,
            chinese: String,
            english: String
        }
    }],
    message: [{
        messageId: {type: String, index: true},
        content: String,
        reply: String,
        year: Number,
        month: Number,
        day: Number,
        document: String,
        readed: Boolean
    }],
    examRecord:[{
        year: Number,
        month: Number,
        day: Number,
        grade: String,
        progress: String,
        subject: String,
        time: String,
        score: String
    }]
},{
    versionKey: false
});

module.exports = mongoose.model('Report', reportSchema);