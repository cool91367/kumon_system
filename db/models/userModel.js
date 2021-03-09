const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    account: {type: String, index: true },
    password: String,
    name: String,
    privil: Number,
    availibleFunction: [String],
    classroomName: String,
    studentList: [{
        studentId: String,
        studentName: String,
        studentGrade: String,
        enrollState: Number,
        unReadMessage: Number
    }],
    parentsPhone: String,
    enrollYear: Number,
    enrollMonth: Number,
    enrollGrade: String,
    parentsLineID: String,
    note: String,
    activeState: Boolean,
    token: String
},{
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);