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

    async getCheckInByYearAndMonth(studentId, year, month) {
        return await this.classOperator.getCheckInByYearAndMonth(studentId, year, month);
    }

    async getDayOffByYearAndMonth(studentId, year, month) {
        return await this.classOperator.getDayOffByYearAndMonth(studentId, year, month);
    }
}

module.exports = ClassSystem