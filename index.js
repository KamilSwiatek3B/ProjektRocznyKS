const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at 5500'));
app.use(express.static('../PSI - ProjektRoczny'));
app.use(express.json({
    limit: '1mb'
}));

const accounts = new Datastore('database/accounts.db');
const failedLog = new Datastore('database/failedLog.db');
accounts.loadDatabase();
failedLog.loadDatabase();

// acounts.insert({username: 'Hero', password: 'Goku'});

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


//creating accounts request
app.post('/register', (request, response) => {
    console.log(request.body); //us ps cd
    accounts.find({
        username: `${request.body.us}`
    }, (err, docs) => {
        if (err) {
            console.log(err);
        } else if (request.body.cd != process.env.ADMIN_KEY) {
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
                password: `${request.body.ps}`
            });

            response.json({
                validity: 'free'
            });
        }
    });
});
