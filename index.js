const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('../PSI - ProjektRoczny'));
// app.use(express.static(__dirname + '/public'));
console.log(__dirname);
app.use(express.json({
    limit: '1mb'
}));

//all databases
const accounts = new Datastore('database/accounts.db');
const failedLog = new Datastore('database/failedLog.db');
const ShopCount = new Datastore('database/votes.db');
const Scores = new Datastore('database/scores.db');
const BestScores = new Datastore('database/bestScores.db');
accounts.loadDatabase(); //accounts credentials
failedLog.loadDatabase(); //logs off any failed logs
ShopCount.loadDatabase(); //keeps track of shop idea votes
Scores.loadDatabase(); //this is where users scores are
BestScores.loadDatabase(); //this is where best scores are



//ShopRequest on main.html request
app.get('/shop', (request, response) => {
    ShopCount.find({ votes: { $gt: 1 } }, (err, docs) => {
        if(err){
            console.log(err);
            return 0;
        }
        response.json({ votes: docs[0].votes });
    });
});

//one more shop vote request
app.post('/shop', (request, response) =>{
    ShopCount.update({ votes: { $gt: 1 } }, { $inc: { votes: 1 } }, function () {});
    response.json({ status: 'ok' });
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
            console.log("invalid")
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

// BestScores.insert({game:'fastKey', username: '', score: 0});
// BestScores.insert({game:'spamer', username: '', score: 0});
// BestScores.insert({game:'aimer', username: '', score: 0});
//creating accounts request
app.post('/register', (request, response) => {
    console.log(request.body); //us ps cd
    accounts.find({
        username: `${request.body.us}`
    }, (err, docs) => {
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
                aimer: 0
                
            });
            
            response.json({
                validity: 'free'
            });
        }
    });
});

//insterting new Best scores if better
function insertBestScore(game,score,us){
    BestScores.find({ game: game }, (err, docs) =>{
        if(err){
            console.log(err);
            return 0;
        }
        if(docs[0].score>score || docs[0].score==0){
            BestScores.update({ game: game }, { $set: { score: score, username: us } }, {}, (err, numReplaced) =>{
                console.log(numReplaced);
            });
            console.log('success');
        }
        // console.log(docs[0].score);
        console.log('besty dziaa');
    })

}

//inserting new scores to user if better
function insertScore(game,score,us){
    accounts.find({
        username: us
    }, (err, docs) => {
        if(err){
            console.log(err);
            return 0;
        }
        // console.log(docs[0][game]);
        if(docs[0][game]>score || docs[0][game]==0){
            accounts.update({ username: us }, { $set: {[game]: score} }, {}, (err, numReplaced) =>{
                //console.log(numReplaced);
            });
        }
    });
    insertBestScore(game,score,us);
}
//score updater TO DO
app.post('/score', (request, response) =>{
    console.log(request.body);
    insertScore(request.body.game, request.body.score, request.body.us);
    response.json({ status: 'ok' });
})