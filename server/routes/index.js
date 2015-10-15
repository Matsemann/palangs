var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));


router.get('/team', function (req, res, next) {
    runQuery('SELECT t.id as tid, t.name as tname, p.id as pid, p.name as pname ' +
        'FROM team t ' +
        'LEFT JOIN participant p ON t.id = p.teamid', null, success, next);

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

});

router.get('/distance/participants', function (req, res, next) {

    runQuery('SELECT d.date, d.meters, p.name, p.id as pid, t.name as tname ' +
        'FROM distancelog d ' +
        'LEFT JOIN participant p ON d.participantid = p.id ' +
        'LEFT JOIN team t ON t.id = p.teamid', null, success, next);


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
                    teamName: row.tname,
                    days: {}
                };
                participants.push(participant);
            }

            participant.totalDistance += row.meters;

            var date = new Date(row.date).toISOString().slice(0, 10);
            participant.days[date] = row.meters;
        }

        res.json(participants);
    }
});

router.get('/distance/teams', function (req, res, next) {

    runQuery('SELECT d.date, SUM(d.meters) as daytotal, t.name as tname, t.id as tid ' +
        'FROM distancelog d ' +
        'LEFT JOIN participant p ON d.participantid = p.id ' +
        'LEFT JOIN team t ON p.teamid = t.id ' +
        'GROUP BY t.id, d.date', null, success, next);


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

            var date = new Date(row.date).toISOString().slice(0, 10);
            team.days[date] = totalDistance;
        }

        res.json(teams);
    }

});


router.post('/team', function (req, res, next) {
    var teamName = req.body.name;
    runQuery("INSERT INTO team(name) values(($1))", [teamName], success, next);

    function success(result) {
        console.log("Created team " + teamName);
        res.json({message: "team created"});
    }
});

router.post('/team/:id/player', function (req, res, next) {
    var playerName = req.body.name;
    var teamId = parseInt(req.params.id, 10);

    runQuery("INSERT INTO participant(teamid, name) values(($1), ($2))", [teamId, playerName], success, next);

    function success(result) {
        console.log("Added player " + playerName + " to teamid " + teamId);
        res.json({message: "player created"});
    }
});

router.post('/distance/:participantid', function (req, res, next) {
    var participantid = parseInt(req.params.participantid, 10);
    var distance = parseInt(req.body.distance, 10);
    var date = req.body.date;

    runQuery("SELECT meters FROM distancelog WHERE date = ($1) AND participantid = ($2)", [date, participantid],
        function (result) {
            if (result.rows.length > 0) {
                runQuery("UPDATE distancelog SET meters = ($1) WHERE date = ($2) AND participantid = ($3)",
                    [distance, date, participantid], success, next);
            } else {
                runQuery("INSERT INTO distancelog(meters, date, participantid) VALUES(($1), ($2), ($3))",
                    [distance, date, participantid], success, next);
            }

            function success(result) {
                console.log("Set distance to " + distance + "for p " + participantid + " at " + date);
                res.json({message: "logged distance"});
            }
        }, next);

});

function runQuery(query, values, callback, errCallback) {
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            done();
            errCallback(err);
            return;
        }
        client.query(query, values, function (err, result) {
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
