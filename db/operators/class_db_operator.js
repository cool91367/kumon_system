const ClassModel = require('../models/classModel');
const ClassBreakModel = require('../models/classBreakModel');

class ClassOperator {

    async addStudent(student) {
        const newStudent = new ClassModel({
            studentId: student.account,
            classDay1: student.classDay1,
            classDay2: student.classDay2,
            checkIn: [{}]
        });
        await newStudent.save();
    }

    async getClassDayByStudentId(studentId) {
        const result = await ClassModel.findOne( {"studentId": studentId} ).select( {"classDay1": 1, "classDay2": 1});
        return result;
    }

    async updateClassDayByStudentId(studentId, classDay1, classDay2) {
        const result = await ClassModel.updateOne( {"studentId": studentId}, {classDay1: classDay1, classDay2: classDay2});
        return result;
    }

    async getBreakDay(teacherId) {
        const result = await ClassBreakModel.findOne( {"teacherId": teacherId} ).select( {"break": 1});
        return result;
    }

    async addBreakDay(teacherId, year, month, day) {
        const result = await ClassBreakModel.aggregate( [
            { "$match": {"teacherId": teacherId} },
            { "$unwind": "$break" },
            { "$match": {"break.year": year, "break.month": month} }
        ]);
        let newBreak = [];

        await ClassBreakModel.updateOne( {"teacherId": teacherId}, {$pull: {break: {
            year: year,
            month: month,
        }}});

        if(result[0]) {
            for(let i = 0;i < result[0].break.day.length;i++) {
                if(result[0].break.day[i] !== day) {
                    newBreak.push(result[0].break.day[i]);
                }
            }
        }
        newBreak.push(day);

        await ClassBreakModel.updateOne( {"teacherId": teacherId}, {$push: {break: {
            year: year,
            month: month,
            day: newBreak
        }}});
    }

    async getCheckInByYearAndMonth(studentId, year, month) {
        const result = await ClassModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$checkIn" },
            { "$match": {"checkIn.year": year, "checkIn.month": month} }
        ]);
        if(!result[0]) {
            return []
        }
        return result[0].checkIn.days;
    }

    async getDayOffByYearAndMonth(studentId, year, month) {
        const result = await ClassModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$checkIn" },
            { "$match": {"checkIn.year": year, "checkIn.month": month} }
        ]);

        if(!result[0]) {
            return []
        }
        if(!result[0].checkIn.note) {
            return []
        }
        return result[0].checkIn.note;
    }

    async addCheckInByStudentId(studentId, year, month, day, time) {
        let newDaysArray = [];
        let newCheckIn = true;
        let oldData = await ClassModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$checkIn" },
            { "$match": {"checkIn.year": year, "checkIn.month": month} }
        ]);
        if(!oldData[0]) {
            newDaysArray.push({
                makeUp: false,
                makeUpDay: "",
                actualDay: day,
                time: time
            });
            await ClassModel.updateOne( {"studentId": studentId }, {$push: {checkIn: {
                "year": year,
                "month": month,
                "note": [],
                "days": newDaysArray
            }}});
            return
        }

        // 更新原有的checkInArr
        await ClassModel.updateOne( {"studentId": studentId }, {$pull: {checkIn: {
            "year": year,
            "month": month
        }}});

        if(oldData[0].checkIn){
            oldData[0].checkIn.days.forEach(function(item) {
                if(item.actualDay == day) {
                    newCheckIn = false;
                    newDaysArray.push({
                        makeUp: false,
                        makeUpDay: "",
                        actualDay: day,
                        time: time
                    });
                }
                else {
                    newDaysArray.push(item)
                }
            });
        }

        if(newCheckIn) {
            newDaysArray.push({
                makeUp: false,
                makeUpDay: "",
                actualDay: day,
                time: time
            })
        }
        await ClassModel.updateOne( {"studentId": studentId }, {$push: {checkIn: {
            "year": year,
            "month": month,
            "note": oldData[0].checkIn.note,
            "days": newDaysArray
        }}});
    }

    async addCheckInMakeUpByStudentId(studentId, year, month, actualDay, makeUpDay, time) {
        let newDaysArray = [];
        let newCheckIn = true;
        let oldData = await ClassModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$checkIn" },
            { "$match": {"checkIn.year": year, "checkIn.month": month} }
        ]);
        if(!oldData[0]) {
            newDaysArray.push({
                makeUp: true,
                makeUpDay: makeUpDay,
                actualDay: actualDay,
                time: time
            });
            await ClassModel.updateOne( {"studentId": studentId }, {$push: {checkIn: {
                "year": year,
                "month": month,
                "note": [],
                "days": newDaysArray
            }}});
            return
        }
        
        // 更新原有的checkInArr
        await ClassModel.updateOne( {"studentId": studentId }, {$pull: {checkIn: {
            "year": year,
            "month": month
        }}});

        if(oldData[0].checkIn){
            oldData[0].checkIn.days.forEach(function(item) {
                if(item.actualDay == actualDay) {
                    newCheckIn = false;
                    newDaysArray.push({
                        makeUp: true,
                        makeUpDay: makeUpDay,
                        actualDay: actualDay,
                        time: time
                    });
                }
                else {
                    newDaysArray.push(item)
                }
            });
        }

        if(newCheckIn) {
            newDaysArray.push({
                makeUp: true,
                makeUpDay: makeUpDay,
                actualDay: actualDay,
                time: time
            })
        }
        await ClassModel.updateOne( {"studentId": studentId }, {$push: {checkIn: {
            "year": year,
            "month": month,
            "note": oldData[0].checkIn.note? oldData[0].checkIn.note : [],
            "days": newDaysArray
        }}});
    }

    async addDayOff(studentId, year, month, day, reason) {
        let newDayOff = true;
        let dayOffArr = [];
        let oldData = await ClassModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$checkIn" },
            { "$match": {"checkIn.year": year, "checkIn.month": month} }
        ]);
        if(!oldData[0]) {
            await ClassModel.updateOne( {"studentId": studentId }, {$push: {checkIn: {
                "year": year,
                "month": month,
                "note": [{
                    day: day,
                    text: reason
                }],
                "days": []
            }}});
            return
        }
        
        // 更新原有的checkInArr
        await ClassModel.updateOne( {"studentId": studentId }, {$pull: {checkIn: {
            "year": year,
            "month": month
        }}});

        if(oldData[0].checkIn){
            oldData[0].checkIn.note.forEach(function(item) {
                if(item.day == day) {
                    newDayOff = false;
                    dayOffArr.push({
                        day: day,
                        text: reason
                    });
                }
                else {
                    dayOffArr.push(item)
                }
            });
        }

        if(newDayOff) {
            dayOffArr.push({
                day: day,
                text: reason
            })
        }
        await ClassModel.updateOne( {"studentId": studentId }, {$push: {checkIn: {
            "year": year,
            "month": month,
            "note": dayOffArr,
            "days": oldData[0].checkIn.days? oldData[0].checkIn.days : [],
        }}});
    }

    async deleteCheckInByStudentId(studentId, year, month, day) {
        let oldData = await ClassModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$checkIn" },
            { "$match": {"checkIn.year": year, "checkIn.month": month} }
        ]);
        let newCheckInArr = []

        await ClassModel.updateOne( {"studentId": studentId }, {$pull: {checkIn: {
            "year": year,
            "month": month
        }}});

        if(oldData[0].checkIn){
            for(let i = 0;i < oldData[0].checkIn.days.length;i++) {
                if(oldData[0].checkIn.days[i].actualDay == day) {
                    continue;
                }
                else {
                    newCheckInArr.push(oldData[0].checkIn.days[i])
                }
            }
        }

        await ClassModel.updateOne( {"studentId": studentId }, {$push: {checkIn: {
            "year": year,
            "month": month,
            "note": oldData[0].checkIn.note? oldData[0].checkIn.note : [],
            "days": newCheckInArr,
        }}});
    }
}

module.exports = ClassOperator;