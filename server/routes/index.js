var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));


router.get('/team', function (req, res, next) {
    runQuery('SELECT t.id as tid, t.name as tname, p.id as pid, p.name as pname ' +
        'FROM team t ' +
        'LEFT JOIN participant p ON t.id = p.teamid', null, success, err);

    function success(result) {
        var teams = [];
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows[i];

            var team = getById(teams, row.tid);
            if (!team) {
                team = {
                    id: row.tid,
                    name: row.tname,
                    participants: []
                };
                teams.push(team);
            }

            if (row.pid) {
                team.participants.push({
                    id: row.pid,
                    name: row.pname
                });
            }
        }

        res.json(teams);
    }

    function err(error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong"});
    }

});

router.get('/distance/participants', function (req, res, next) {

    runQuery('SELECT d.date, d.meters, p.name, p.id as pid ' +
        'FROM distancelog d ' +
        'LEFT JOIN participant p ON d.participantid = p.id', null, success, err);


    function success(result) {
        var participants = [];

        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows[i];

            var participant = getById(participants, row.pid);
            if (participant == null) {
                participant = {
                    id: row.pid,
                    name: row.name,
                    totalDistance: 0,
                    days: {}
                };
                participants.push(participant);
            }

            participant.totalDistance += row.meters;

            var date = new Date(row.date).toISOString().slice(0,10);
            participant.days[date] = row.meters;
        }

        res.json(participants);
    }

    function err(error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong"});
    }
});

router.get('/distance/teams', function (req, res, next) {

    runQuery('SELECT d.date, SUM(d.meters) as daytotal, t.name as tname, t.id as tid ' +
        'FROM distancelog d ' +
        'LEFT JOIN participant p ON d.participantid = p.id ' +
        'LEFT JOIN team t ON p.teamid = t.id ' +
        'GROUP BY t.id, d.date', null, success, err);


    function success(result) {
        var teams = [];


        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows[i];

            var team = getById(teams, row.tid);

            if (team == null) {
                team = {
                    id: row.tid,
                    name: row.tname,
                    totalDistance: 0,
                    days: {}
                };
                teams.push(team);
            }

            var totalDistance = parseInt(row.daytotal, 10);
            team.totalDistance += totalDistance;

            var date = new Date(row.date).toISOString().slice(0,10);
            team.days[date] = totalDistance;
        }

        res.json(teams);
    }

    function err(error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong"});
    }
});

function runQuery(query, values, callback, errCallback) {
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            done();
            errCallback(err);
        }
        client.query(query, values, function(err, result) {
            done();

            if (err) {
                errCallback(err);
            } else {
                callback(result);
            }
        });
    });
}

function getById(collection, id) {
    for (var i = 0; i < collection.length; i++) {
        if (collection[i].id == id) {
            return collection[i];
        }
    }
    return null;
}


module.exports = router;
