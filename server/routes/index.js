var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));


router.get('/test', function (req, res) {
    return res.json({mats: "er kul", eller: "hva?"});
});


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
        return res.status(500).json({ error: "Something went wrong"});
    }

});

function getById(collection, id) {
    for (var i = 0; i < collection.length; i++) {
        if (collection[i].id == id) {
            return collection[i];
        }
    }
    return null;
}

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


module.exports = router;
