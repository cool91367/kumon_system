const express = require('express');
const router = express.Router();
const UserSystem = require('../controller/user_system');
const ReportSystem = require('../controller/report_system');
const auth = require('./middleware/auth');

const userSystem = new UserSystem();
const reportSystem = new ReportSystem();


router.post('/progress/new', auth, async function(req, res) {
    if(req.userInfo.privil < 2) {
        return res.status(404).send( { err: "auth error" } );
    }

    try {
        await reportSystem.addProgressRecord(
            req.body.year,
            req.body.month,
            req.body.progresses);
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {message: "OK"} );
});

router.post('/progress/update', auth, async function(req, res) {
    try {
        await reportSystem.updateOneProgress(
            req.body.studentId,
            req.body.year,
            req.body.month,
            req.body.math,
            req.body.chinese,
            req.body.english,
            req.body.grade
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {"message": "OK"} )
});

router.get('/:studentId', auth, async function(req, res) {
    let result = null;
    try {
        result = await reportSystem.getStudentReport(req.params.studentId);
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send(result);
});

router.get('/analyzeHistory/:studentId', auth, async function(req, res) {
    let result = null;
    try {
        result = await reportSystem.getStudentAnalyzeData(req.params.studentId);
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    if(!result) {
        result = false;
    }
    return res.status(200).send(result);
});

router.post('/analyze/update', auth, async function(req, res) {
    try {
        await reportSystem.updateOrAddAnalyzeResult(
            req.body.studentId, 
            req.body.year, 
            req.body.month, 
            req.body.grade, 
            req.body.math, 
            req.body.chinese, 
            req.body.english, 
            req.body.mathI, 
            req.body.chineseI, 
            req.body.englishI, 
            req.body.predictRange, 
            req.body.predictMath, 
            req.body.predictChinese, 
            req.body.predictEnglish,
            req.body.ILine
            );
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {message: "OK"} );
});

router.post('/exam/update', auth, async function(req, res) {
    try {
        await reportSystem.addStudentExamResult(
            req.body.studentId,
            req.body.year,
            req.body.month,
            req.body.day,
            req.body.examGrade, 
            req.body.examProgress, 
            req.body.examSubject, 
            req.body.examTime, 
            req.body.examScore
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {message: "OK"} );
});

router.get('/examHistory/:studentId', auth, async function(req, res) {
    let result = null;
    try {
        result = await reportSystem.getStudentExamRecord(req.params.studentId);
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    if(!result) {
        result = false;
    }
    return res.status(200).send(result);
});


module.exports = router;