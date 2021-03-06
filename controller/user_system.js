const UserOperator = require('../db/operators/user_db_operator');
const ReportOperator = require('../db/operators/report_db_operator');
const ClassOperator = require('../db/operators/class_db_operator');
const { uuid } = require('uuidv4');
const jwt = require('jsonwebtoken');
const SECRET = require('../config/credential/credential').jwtKey;

class UserSystem {
    constructor(){
        this.userOperator = new UserOperator();
        this.reportOperator = new ReportOperator();
        this.classOperator = new ClassOperator();
    }

    async newStudent(name, parentsPhone, enrollYear, enrollMonth, enrollDay, enrollGrade, parentsLineID, note, classDay1, classDay2) {
        const newAccount = uuid();
        // generate new jwt token
        const newToken = jwt.sign({ account: newAccount, privil: 1}, SECRET);

        const newUser = {
            account: newAccount,
            password: parentsPhone,
            name: name,
            privil: 1,
            parentsPhone: parentsPhone,
            enrollYear: enrollYear,
            enrollMonth: enrollMonth,
            enrollDay: enrollDay,
            enrollGrade: enrollGrade,
            parentsLineID: parentsLineID,
            note: note,
            classDay1: classDay1,
            classDay2: classDay2,
            token: newToken
        }
        await this.userOperator.addUser(newUser);
        await this.reportOperator.addStudent(newUser);
        await this.classOperator.addStudent(newUser);

        return newAccount;
    }

    async newTeacher(name, account, password, availibleFunction, classroomName, note) {
        // generate new jwt token and new account
        const newToken = jwt.sign({ account: account, privil: 2, classroomName: classroomName}, SECRET);

        const newUser = {
            account: account,
            password: password,
            name: name,
            availibleFunction: availibleFunction,
            privil: 2,
            classroomName: classroomName,
            note: note,
            token: newToken
        }
        await this.userOperator.addUser(newUser);

        return newToken;
    }

    async login(account, password) {
        return this.userOperator.getUserByAccountAndPassword(account, password);
    }

    async addStudentToStudentList(teacherAccount, studentId, studentName, studentGrade, enrollState, unReadMessage) {
        const newStudent = {
            studentId: studentId,
            studentName: studentName,
            studentGrade: studentGrade,
            enrollState: enrollState,
            unReadMessage: unReadMessage
        }

        return await this.userOperator.pushToStudentList(teacherAccount, newStudent);
    }

    async getTeacherStudentList(teacherAccount) {
        return await this.userOperator.getUserStudentList(teacherAccount);
    }

    async setStudentEnrollState(account, studentId, state) {
        return await this.userOperator.updateStudentEnrollState(account, studentId, state);
    }

    async getStudentByAccount(account) {
        return await this.userOperator.getUserByAccount(account);
    }
}

module.exports = UserSystem