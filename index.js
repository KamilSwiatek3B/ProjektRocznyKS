const {
    response
} = require('express');
const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('../PSI - ProjektRoczny'));
// app.use(express.static(__dirname + '/public'));
app.use(express.json({
    limit: '1mb'
}));

//all databases
const accounts = new Datastore('database/accounts.db');
const failedLog = new Datastore('database/failedLog.db');
const ShopCount = new Datastore('database/votes.db');
const BestScores = new Datastore('database/bestScores.db');
accounts.loadDatabase(); //accounts credentials
failedLog.loadDatabase(); //logs off any failed logs
ShopCount.loadDatabase(); //keeps track of shop idea votes
BestScores.loadDatabase(); //this is where best scores are

//Best scores inserting scheme
// BestScores.insert({game:'fastKey', username: '', score: 0});
// BestScores.insert({game:'spamer', username: '', score: 0});
// BestScores.insert({game:'Roulette', username: '', score: 0});


//updates money on account with each roll
app.post('/updateMoney', (request, response) => {
    accounts.update({username: request.body.us}, {$set: {Roulette: request.body.konto}
    }, {}, (err, numReplaced) => {
        accounts.loadDatabase(); //accounts credentials
    });
})
//get money for roulette
app.post('/getMoney', (request, response) => {
    if(request.body.flag==true){
        accounts.find({username: `${request.body.us}`}, (err, docs) => {
            if (err) {
                console.log(err);
            }else if(docs[0].Daily!=Math.floor(Date.now()/(1000*60*60*24))){
                response.json({
                    status: true
                });
            }else{
                response.json({
                    status: false
                });
            }
        });
        accounts.update({username: request.body.us}, {$set: {Daily: Math.floor(Date.now()/(1000*60*60*24))}
        }, {}, (err, numReplaced) => {
            accounts.loadDatabase(); //accounts credentials
        });
    }else{
        accounts.find({username: request.body.us}, (err, docs) => {
            if (docs[0] == null) return 0;
            response.json({
                status: docs[0].Roulette
            });        
        })
    }
})

//get sneezes for spamer
app.post('/getSneeze', (request, response) => {
    accounts.find({
        username: request.body.us
    }, (err, docs) => {
        if (docs[0] != null) {
            response.json({
                status: docs[0].spamer
            });
        }
    })
})

//request for best scores
app.get('/score', (request, response) => {
    BestScores.find({}, (err, docs) => {
        response.json({
            data: docs
        });
    })
})

//ShopRequest on main.html request
app.get('/shop', (request, response) => {
    ShopCount.find({votes: {$gt: 1}}, (err, docs) => {
        if (err) {
            console.log(err);
            return 0;
        }
        response.json({
            votes: docs[0].votes
        });
    });
});

//one more shop vote request
app.post('/shop', (request, response) => {
    console.log(request.body);
    ShopCount.update({
        votes: {
            $gt: 1
        }
    }, {
        $inc: {
            votes: request.body.inc
        }
    }, function () {});
    response.json({
        status: 'ok'
    });
})

//login validation request
app.post('/index', (request, response) => {
    console.log(request.body);
    accounts.find({
        username: `${request.body.us}`
    }, (err, docs) => {
        if (err) {
            console.log(err);
        } else if (docs[0] != undefined && docs[0].password == request.body.ps) {
            // console.log(docs[0].username);
            // console.log(docs[0].password);
            response.json({
                validation: 'true',
                username: JSON.stringify(request.body.us)
            });
        } else {
            let date = new Date();
            let time = date.toUTCString();
            failedLog.insert({
                type: 'Invalid',
                timestamp: `${time}`,
                username: `${request.body.us}`,
                password: `${request.body.ps}`
            });
            response.json({
                validation: 'false'
            });
        };
    });
});

//creating accounts request
app.post('/register', (request, response) => {
    console.log(request.body); //us ps cd
    accounts.find({username: `${request.body.us}`}, (err, docs) => {
        if (err) {
            console.log(err);
        } else if (request.body.cd !== '437437') {
            response.json({
                validity: 'code'
            });
        } else if (docs[0] != undefined) {
            response.json({
                validity: 'occ'
            });
        } else {
            accounts.insert({
                username: `${request.body.us}`,
                password: `${request.body.ps}`,
                fastKey: 0,
                spamer: 0,
                Roulette: 1000,
                Daily: 1
            });

            response.json({
                validity: 'free'
            });
        }
    });
});

//insterting new BEST scores if better
function insertBestScore(game, score, us) {
    BestScores.find({
        game: game
    }, (err, docs) => {
        if (err) {
            console.log(err);
            return 0;
        }
        if (game == 'fastKey') {
            if (docs[0].score > score || docs[0].score == 0) {
                BestScores.update({
                    game: game
                }, {
                    $set: {
                        score: score,
                        username: us
                    }
                }, {}, (err, numReplaced) => {
                    //console.log(numReplaced);
                    BestScores.loadDatabase(); //this is where best scores are

                });
            }
        } else {
            if (docs[0].score < score || docs[0].score == 0) {
                BestScores.update({
                    game: game
                }, {
                    $set: {
                        score: score,
                        username: us
                    }
                }, {}, (err, numReplaced) => {
                    //console.log(numReplaced);
                    BestScores.loadDatabase(); //this is where best scores are

                });
            }
        }
    })

}

//inserting new SCORES to user if better
function insertScore(game, score, us) {
    accounts.find({
        username: us
    }, (err, docs) => {
        if (err) {
            console.log(err);
            return 0;
        }
        if (game == 'fastKey') {
            if (docs[0][game] > score || docs[0][game] == 0) {
                accounts.update({
                    username: us
                }, {
                    $set: {
                        [game]: score
                    }
                }, {}, (err, numReplaced) => {});
                accounts.loadDatabase(); //accounts credentials
            }
        } else {
            if (docs[0][game] < score || docs[0][game] == 0) {
                accounts.update({
                    username: us
                }, {
                    $set: {
                        [game]: score
                    }
                }, {}, (err, numReplaced) => {});
                accounts.loadDatabase(); //accounts credentials
            }
        }
    });
    insertBestScore(game, score, us);
}
//score updater 
app.post('/score', (request, response) => {
    insertScore(request.body.game, request.body.score, request.body.us);
    response.json({
        status: 'ok'
    });
})