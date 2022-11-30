const UserOperator = require('../db/operators/user_db_operator');
const ReportOperator = require('../db/operators/report_db_operator');
const readXlsxFile = require('read-excel-file/node');

let ILine = {
    "幼小": {},
    "幼中": {},
    "幼大": {},
    "小一": {},
    "小二": {},
    "小三": {},
    "小四": {},
    "小五": {},
    "小六": {},
    "國一": {},
    "國二": {},
    "國三": {},
    "高一": {},
    "高二": {},
    "高三": {}
}
const gradeReadSeq = ["高三", "高二", "高一", "國三", "國二", "國一", "小六", "小五", "小四", "小三", "小二", "小一", "幼大", "幼中", "幼小"];
const monthReadSeq = ["9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7", "8"]
readXlsxFile(process.cwd() + '/config/I線.xlsx').then((rows) => {
    for(let grade = 1; grade < 16; grade++) {
        for(let month = 1; month < 13; month++) {
            ILine[gradeReadSeq[grade - 1]][monthReadSeq[month - 1]] = rows[grade][month];
        }
    }
})

class ReportSystem {
    constructor(){
        this.userOperator = new UserOperator();
        this.reportOperator = new ReportOperator();
    }

    async addProgressRecord(year, month, progresses) {
        for (const progress in progresses) {
            if(progresses[progress].grade == "幼未") {
                continue;
            }
            console.log(month)
            console.log(progresses[progress])
            progresses[progress].ILine = ILine[progresses[progress].grade][month.toString()];
            if(progresses[progress].math) {
                let math = progresses[progress].math;
                math = replaceSubjectTitle(math);
                progresses[progress].mathI = operateILine(ILine[progresses[progress].grade][month.toString()] , math);
            }
            if(progresses[progress].chinese) {
                let chinese = progresses[progress].chinese;
                chinese = replaceSubjectTitle(chinese);
                progresses[progress].chineseI = operateChineseILine(ILine[progresses[progress].grade][month.toString()] , chinese);
            }
            if(progresses[progress].english) {
                let english = progresses[progress].english;
                english = replaceSubjectTitle(english);
                progresses[progress].englishI = operateILine(ILine[progresses[progress].grade][month.toString()] , english);
            }
        }
        await this.reportOperator.addProgress(year, month, progresses);
    }

    async updateOneProgress(studentId, year, month, math, chinese, english, grade) {
        let progress = {}
        if(math) {
            progress.math = math;
            progress.mathI = operateILine(ILine[grade][month.toString()], replaceSubjectTitle(math));
        }
        else{
            progress.math = "";
            progress.mathI = "";
        }
        if(chinese) {
            progress.chinese = chinese;
            progress.chineseI = operateChineseILine(ILine[grade][month.toString()], replaceSubjectTitle(chinese));
        }
        else{
            progress.chinese = "";
            progress.chineseI = "";
        }
        if(english) {
            progress.english = english;
            progress.englishI = operateILine(ILine[grade][month.toString()], replaceSubjectTitle(english));
        }
        else {
            progress.english = "";
            progress.englishI = "";
        }
        progress.ILine = ILine[grade][month.toString()];
        await this.reportOperator.updateProgressByStudentId(studentId, year, month, progress, grade);
    }

    async getStudentReport(studentId) {
        const result = await this.reportOperator.getReportByStudentId(studentId);
        return result;
    }

    async updateOrAddAnalyzeResult(studentId, year, month, grade, math, chinese, english, mathI, chineseI, englishI, predictRange, predictMath, predictChinese, predictEnglish, ILine) {
        const progress = {
            grade: grade,
            math: math,
            chinese: chinese,
            english: english,
            mathI: mathI,
            chineseI: chineseI,
            englishI: englishI,
            predictRange: predictRange,
            predictMath: predictMath,
            predictChinese: predictChinese,
            predictEnglish: predictEnglish,
            ILine: ILine
        }
        
        await this.reportOperator.addAnalyzeResult(studentId, year, month, progress)
    }

    async getStudentAnalyzeData(studentId) {
        const result = await this.reportOperator.getAnalyzeDataByStudentId(studentId);
        return result;
    }

    async addStudentExamResult(studentId, year, month, day, examGrade, examProgress, examSubject, examTime, examScore) {
        const exam = {
            grade: examGrade,
            progress: examProgress,
            subject: examSubject,
            time: examTime,
            score: examScore
        }
        await this.reportOperator.addExamResult(studentId, year, month, day, exam);
    }

    async deleteStudentExamResult(studentId, year, month, day, subject) {
        await this.reportOperator.deleteExamResult(studentId, year, month, day, subject);
    }

    async getStudentExamRecord(studentId) {
        const result = await this.reportOperator.getExamResultByStudentId(studentId);
        return result;
    }
}

function replaceSubjectTitle(subject) {
    subject = subject.replace("5A", "=");
    subject = subject.replace("4A", ">");
    subject = subject.replace("3A", '?');
    subject = subject.replace("2A", "@");
    return subject;
}

function operateILine(ILine , progress){
    if(progress.charCodeAt(0) > ILine.charCodeAt(0)){
        var myProgressNum = Number(progress.substring(1 , progress.length));
        var ILineProgressNum = Number(ILine.substring(1 , ILine.length));
        var diff = progress.charCodeAt(0) - ILine.charCodeAt(0);
        diff = (diff - 1) * 200;
        diff += (200 - ILineProgressNum) + myProgressNum;
        return '+' + diff;
    }
    else if(progress.charCodeAt(0) == ILine.charCodeAt(0)){
        var myProgressNum = Number(progress.substring(1 , progress.length));
        var ILineProgressNum = Number(ILine.substring(1 , ILine.length));
        var diff = myProgressNum - ILineProgressNum;
        if(diff > 0)
            return '+' + diff;
        else if(diff == 0)
            return "0";
        else    
            return diff;
    }
    else{
        var myProgressNum = Number(progress.substring(1 , progress.length));
        var ILineProgressNum = Number(ILine.substring(1 , ILine.length));
        var diff = ILine.charCodeAt(0) - progress.charCodeAt(0);
        diff = (diff - 1) * 200;
        diff += 200 - myProgressNum + ILineProgressNum;
        return '-' + diff;
    }
}

function operateChineseILine(ILine , progress){
    var myProgressNum;
    if(progress[0] === 'A') {
        myProgressNum = Number(progress.substring(1 , progress.length)) / 2
    } else {
        myProgressNum = Number(progress.substring(1 , progress.length))
    }

    if(progress.charCodeAt(0) > ILine.charCodeAt(0)){
        var ILineProgressNum = Number(ILine.substring(1 , ILine.length));
        var diff = progress.charCodeAt(0) - ILine.charCodeAt(0);
        diff = (diff - 1) * 200;
        diff += (200 - ILineProgressNum) + myProgressNum;
        return '+' + diff;
    }
    else if(progress.charCodeAt(0) == ILine.charCodeAt(0)){
        var ILineProgressNum = Number(ILine.substring(1 , ILine.length));
        var diff = myProgressNum - ILineProgressNum;
        if(diff > 0)
            return '+' + diff;
        else if(diff == 0)
            return "0";
        else    
            return diff;
    }
    else{
        var ILineProgressNum = Number(ILine.substring(1 , ILine.length));
        var diff = ILine.charCodeAt(0) - progress.charCodeAt(0);
        diff = (diff - 1) * 200;
        diff += 200 - myProgressNum + ILineProgressNum;
        return '-' + diff;
    }
}

module.exports = ReportSystem