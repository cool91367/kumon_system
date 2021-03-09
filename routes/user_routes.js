const express = require('express');
const router = express.Router();
const UserSystem = require('../controller/user_system');
const auth = require('./middleware/auth');

const userSystem = new UserSystem();

router.post('/student/new', auth, async function(req, res) {
    try {
        await userSystem.newStudent(
            req.body.studentName,
            req.body.newAccount,
            req.body.parentsPhone, 
            req.body.enrollYear, 
            req.body.enrollMonth, 
            req.body.enrollGrade, 
            req.body.parentsLineID,
            req.body.note,
            req.body.classDay1,
            req.body.classDay2
            );
        
        const enrollState = 1;
        const unReadMessage = 0;
        await userSystem.addStudentToStudentList(
            req.body.teacherAccount,
            req.body.newAccount,
            req.body.studentName,
            req.body.enrollGrade,
            enrollState,
            unReadMessage,
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    } 
    return res.status(200).send( {"message": "OK"} );
});

router.post('/teacher/new', async function(req, res) {
    try {
        token = await userSystem.newTeacher(
            req.body.name,
            req.body.account,
            req.body.password, 
            req.body.availibleFunction, 
            req.body.classroomName, 
            req.body.note
            );
    } catch(err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    } 
    return res.status(200).send( {"message": "OK"} );
});

router.post('/login', async function(req, res) {
    let user = null;
    try{
        user = await userSystem.login(
            req.body.userAccount,
            req.body.userPassword
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    }


    if(!user) {
        return res.status(400).send( {"message": "not a user"} )
    }
    res.cookie('userAccount', req.body.userAccount);
    res.cookie('userPassword', req.body.userPassword);
    res.cookie('jwtToken', user.token);
    return res.status(200).send(user);
});

router.get('/:teacherAccount/studentList', auth, async function(req, res) {
    if(req.userInfo.privil < 2) {
        return res.status(404).send( { err: "auth error" } );
    }
    try {
        studentList = await userSystem.getTeacherStudentList(req.params.teacherAccount);
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send(studentList);
});

router.post('/student/enroll_state/update', auth, async function(req, res) {
    if(req.userInfo.privil < 2) {
        return res.status(404).send( { err: "auth error" } );
    }
    try {
        await userSystem.setStudentEnrollState(
            req.body.teacherAccount, 
            req.body.studentId, 
            req.body.updateState)
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {message: "OK"} );
})


router.post('/testAuth', auth, async function(req, res) {
    console.log(req.userInfo);
    return res.status(200).send( {"message": "OK"} );
});

module.exports = router;