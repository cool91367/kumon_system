const ReportModel = require('../models/reportModel');

class ReportOperator {

    async addStudent(student) {
        const newStudent = new ReportModel({
            studentId: student.account,
            enrollYear: student.enrollYear,
            enrollMonth: student.enrollMonth,
            enrollGrade: student.enrollGrade
        });
        await newStudent.save();
    }

    async addProgress(year, month, progresses) {
        for(let progress in progresses) {
            if(progresses[progress].grade == "幼未") {
                continue;
            }
            await ReportModel.updateOne( {"studentId": progresses[progress].studentId }, {$pull: {progress: {
                "year": year,
                "month": month
            }}});

            await ReportModel.updateOne( {"studentId": progresses[progress].studentId }, {$push: {progress: {
                "grade": progresses[progress].grade,
                "year": year,
                "month": month,
                "progress": {
                    "math": progresses[progress].math? progresses[progress].math : "",
                    "mathI": progresses[progress].mathI? progresses[progress].mathI : "",
                    "chinese": progresses[progress].chinese? progresses[progress].chinese : "",
                    "chineseI": progresses[progress].chineseI? progresses[progress].chineseI : "",
                    "english": progresses[progress].english? progresses[progress].english : "",
                    "englishI": progresses[progress].englishI? progresses[progress].englishI : "",
                    "ILine": progresses[progress].ILine
                }
            }}});
        }
    }

    async getReportByStudentId(studentId) {
        const result = await ReportModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$progress" },
            { "$sort": { "progress.year": 1, "progress.month": 1} },
            { "$group": { "_id": "$_id", "progress": { "$push": "$progress" } } }
        ]);
        
        return result[0];
    }

    async addAnalyzeResult(studentId, year, month, progress) {
        await ReportModel.updateOne( {"studentId": studentId }, {$pull: {analyzeData: {
            "year": year,
            "month": month
        }}});

        await ReportModel.updateOne( {"studentId": studentId }, {$push: {analyzeData: {
            "grade": progress.grade,
            "year": year,
            "month": month,
            "iLine": progress.ILine,
            "progress": {
                "math": progress.math,
                "chinese": progress.chinese,
                "english": progress.english
            },
            "ILine": {
                "math": progress.mathI,
                "chinese": progress.chineseI,
                "english": progress.englishI
            },
            "predict": {
                "after": progress.predictRange,
                "math": progress.predictMath,
                "chinese": progress.predictChinese,
                "english": progress.predictEnglish
            }
        }}});
    }

    async getAnalyzeDataByStudentId(studentId) {
        const result = await ReportModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$analyzeData" },
            { "$sort": { "analyzeData.year": 1, "analyzeData.month": 1} },
            { "$group": { "_id": "$_id", "analyzeData": { "$push": "$analyzeData" } } },
            { "$project": { "analyzeData": 1 } }
        ]);
        
        return result[0];
    }

    async addExamResult(studentId, year, month, day, exam) {
        await ReportModel.updateOne( {"studentId": studentId }, {$pull: {examRecord: {
            "year": year,
            "month": month,
            "day": day
        }}});

        await ReportModel.updateOne( {"studentId": studentId }, {$push: {examRecord: {
            "year": year,
            "month": month,
            "day": day,
            "grade": exam.grade,
            "progress": exam.progress,
            "subject": exam.subject,
            "time": exam.time,
            "score": exam.score
        }}});
    }

    async getExamResultByStudentId(studentId) {
        const result = await ReportModel.aggregate( [
            { "$match": {"studentId": studentId} },
            { "$unwind": "$examRecord" },
            { "$sort": { "examRecord.year": 1, "examRecord.month": 1, "examRecord.day": 1} },
            { "$group": { "_id": "$_id", "examRecord": { "$push": "$examRecord" } } },
            { "$project": { "examRecord": 1 } }
        ]);
        
        return result[0];
    }

}

module.exports = ReportOperator;