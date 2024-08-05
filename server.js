const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 80;

//allow all
app.use(cors());

//Get current file content
let db = fs.readFileSync('./data.json', 'utf-8');
db = JSON.parse(db);

//create subject
app.get('/create', (req, res, next) => {
    let title = req.query.title || '';
    let dbStr = '';

    //Param checking
    if( title === '' ){
        res.status(403).json({
            'Msg' : 'Param (title) missing'
        });
    }
    
    if( !db[title] ){
        db[title] = []; //update current db obj before update json file
        dbStr = JSON.stringify(db); 

        fs.writeFileSync('./data.json', dbStr);

        res.status(203).json({
            'Msg' : 'Subject created'
        });
    }else {
        res.status(403).json({
            'Msg' : 'Subject already existed'
        });
    }
});

app.get('/update', (req, res, next) => {
    let title = req.query.title || '';
    let front = req.query.front || '';
    let back = req.query.back || '';
    let dbStr = '';

    //Param checking
    if( title === '' || front === '' || back === ''){
        res.status(403).json({
            'Msg' : 'Param (title/front/back) missing'
        });
    }
    
    if( db[title] ){
        db[title].push({ "front" : front, "back" : back });

        dbStr = JSON.stringify(db); 
        fs.writeFileSync('./data.json', dbStr);

        res.status(200).json({
            'Msg' : 'Document updated'
        });
    }else{
        res.status(403).json({
            'Msg' : 'Subject not existed, you should create the subject first'
        });
    }
});

app.get('/read', (req, res, next) => {
    let data = fs.readFileSync('./data.json', 'utf-8');
    data = JSON.parse(data);

    res.status(200).json({
        data
    });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})