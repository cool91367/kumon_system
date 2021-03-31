const UserOperator = require('../db/operators/user_db_operator');
const ClassOperator = require('../db/operators/class_db_operator');

class ClassSystem {
    constructor(){
        this.userOperator = new UserOperator();
        this.classOperator = new ClassOperator();
    }

    async addCheckIn(studentId, year, month, day, time) {
        return await this.classOperator.addCheckInByStudentId(studentId, year, month, day, time);
    }

    async addCheckInMakeUp(studentId, year, month, actualDay, makeUpDay, time) {
        return await this.classOperator.addCheckInMakeUpByStudentId(studentId, year, month, actualDay, makeUpDay, time);
    }

    async addDayOff(studentId, year, month, day, reason) {
        return await this.classOperator.addDayOff(studentId, year, month, day, reason);
    }

    async getClassDay(studentId) {
        return await this.classOperator.getClassDayByStudentId(studentId);
    }

    async changeClassDay(studentId, classDay1, classDay2) {
        return await this.classOperator.updateClassDayByStudentId(studentId, classDay1, classDay2);
    }

    async getCheckInByYearAndMonth(studentId, year, month) {
        return await this.classOperator.getCheckInByYearAndMonth(studentId, year, month);
    }

    async getDayOffByYearAndMonth(studentId, year, month) {
        return await this.classOperator.getDayOffByYearAndMonth(studentId, year, month);
    }

    async deleteCheckInByYearAndMonthAndDay(studentId, year, month, day) {
        return await this.classOperator.deleteCheckInByStudentId(studentId, year, month, day);
    }
}

module.exports = ClassSystem