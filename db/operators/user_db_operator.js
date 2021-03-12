const UserModel = require('../models/userModel');

class UserOperator {

    async addUser(user) {
        const newUser = new UserModel({
            account: user.account,
            password: user.password,
            name: user.name? user.name: "",
            privil: user.privil? user.privil : 1,
            availibleFunction: user.availibleFunction? user.availibleFunction : null,
            classroomName: user.classroomName?　user.classroomName : null,
            studentList: user.studentList? user.studentList : [],
            parentsPhone: user.parentsPhone? user.parentsPhone : null,
            enrollYear: user.enrollYear? user.enrollYear : null,
            enrollMonth: user.enrollMonth? user.enrollMonth : null,
            enrollDay: user.enrollDay? user.enrollDay : null,
            enrollGrade: user.enrollGrade? user.enrollGrade : null,
            parentsLineID: user.parentsLineID? user.parentsLineID : null,
            note: user.note? user.note : null,
            activeState: user.activeState? user.activeState : true,
            token: user.token
        });
        await newUser.save();
    }

    async getUserByAccountAndPassword(account, password) {
        const result = await UserModel.findOne( {"account": account, "password": password} ).exec();
        return result;
    }

    async pushToStudentList(teacherAccount, student) {
        await UserModel.findOneAndUpdate( { account: teacherAccount }, { $push: { studentList: student } } )
    }

    async getUserStudentList(account) {
        const result = await UserModel.findOne( {"account": account} ).select( {"studentList": 1} );
        return result
    }

    async updateStudentEnrollState(account, studentId, state) {
        const result = await UserModel.updateOne( {"account": account, "studentList.studentId": studentId}, { '$set': {'studentList.$.enrollState': state} })
        return result
    }
}

module.exports = UserOperator;