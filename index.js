var express = require('express');
var app = express();
var elasticsearch = require('elasticsearch');
var client = elasticsearch.Client({
    host: "localhost:9200",
    log: "trace"
})

//Ping to check if connection established 

client.ping({requestTimeout: 1000},function(err){
    if(err)
        console.log(err);
    else
        console.log("ElasticSearch is working fine")
})

//Checking If document exists

app.post('/elasticsearch/checkIfDocExists', (req, res) => {
    var id = req.body.id
    client.exists({
        index: "twitter",
        type: "_doc",
        id: id
    }).then((response) => {
        res.send(response);
    })
})

//Insering New Document in ElasticSearch

app.post('/elasticsearch/insertNewDoc',(req,res)=>{
    var payload = req.body.payload
    client.create({
        index: "twitter",
        type:"_doc",
        id:"1",
        body:{
            payload
        }
    }).then((response)=>{
        res.send(response);
    })
})

//Updating an existing document in ElasticSearch

app.post('/elasticsearch/updateDoc', (req, res) => {
    var id = req.body.id;
    var grade = req.body.grade;
    client.update({
        index: "twitter",
        type: "_doc",
        id: id,
        body:{
            doc:{
                grade:grade
            }
        }
    }).then((response) => {
        res.send(response);
    })
})


//Search with wildcard options

app.get('/elasticsearch/searchWithWildcardMatch', (req, res) => {
    var searchField = req.query.searchItem || "";
    client.search({
        index: "twitter",
        type: "_doc",
        body: {
            query: {
                wildcard: {
                    user: '*' + searchField + '*'
                }
            }
        }
    }).then((response) => {
        res.send(response.hits.hits)
    })
})

//Search with entire match

app.get('/elasticsearch/searchWithEntireMatch', (req, res) => {
    var searchField = req.query.searchItem;
    client.search({
        index: "twitter",
        type: "_doc",
        body: {
            query: {
                match: {
                    user: searchField
                }
            }
        }
    }).then((response) => {
        res.send(response.hits.hits)
    })
})

app.listen(9020, () => {
    console.log('Listening on 9020')
})

