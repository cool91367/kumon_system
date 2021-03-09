const express = require('express');
const router = express.Router();
const ClassSystem = require('../controller/class_system');
const auth = require('./middleware/auth');

const classSystem = new ClassSystem();

router.post('/checkIn/update', auth, async function(req, res) {
    try {
        await classSystem.addCheckIn(
            req.body.studentId, 
            req.body.year, 
            req.body.month, 
            req.body.day, 
            req.body.time
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {message: "OK"} );
});

router.post('/makeUp/update', auth, async function(req, res) {
    try {
        await classSystem.addCheckInMakeUp(
            req.body.studentId, 
            req.body.year, 
            req.body.month, 
            req.body.actualDay,
            req.body.makeUpDay, 
            req.body.time
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {message: "OK"} );
});

router.post('/dayOff/update', auth, async function(req, res) {
    try {
        await classSystem.addDayOff(
            req.body.studentId, 
            req.body.year, 
            req.body.month, 
            req.body.day, 
            req.body.reason
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send( {message: "OK"} );
});

router.get('/:studentId/classDay', auth, async function(req, res) {
    let result = null;
    try {
        result = await classSystem.getClassDay(req.params.studentId);
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send(result);
});

router.get('/:studentId/:year/:month/checkIn', auth, async function(req, res) {
    let result = null;
    try {
        result = await classSystem.getCheckInByYearAndMonth(
            req.params.studentId,
            req.params.year,
            req.params.month
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send(result);
});

router.get('/:studentId/:year/:month/dayOff', auth, async function(req, res) {
    let result = null;
    try {
        result = await classSystem.getDayOffByYearAndMonth(
            req.params.studentId,
            req.params.year,
            req.params.month
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send( {err: err.message} );
    }
    return res.status(200).send(result);
});

module.exports = router;