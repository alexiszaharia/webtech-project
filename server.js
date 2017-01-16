var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT);


var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

//include sequelize and init sequelize connexion
var Sequelize=require("sequelize");
var sequelize=new Sequelize('transport', 'alexiszaharia', '', {
   dialect: 'mysql',
   host: '127.0.0.1',
   port: 3306
});

//define entity
var Soferi=sequelize.define('soferi', {
    nume: {
        type: Sequelize.STRING,
        field: 'nume'
    },
    vechime: {
        type: Sequelize.INTEGER,
        field: 'vechime'
    },
    masina: {
        type: Sequelize.STRING,
        field: 'masina'
    },
    numar_telefon: {
        type: Sequelize.STRING,
        field: 'numar_telefon'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email'
    }
}, {
    timestamps: false,
    freezeTableName: true
});

//CRUD operations
//creare sofer
app.post('/soferi', function(request, response){
    Soferi.create(request.body).then(function(soferi){
       Soferi.findById(soferi.id).then(function(soferi){
           response.status(201).sent(soferi);
       }) ;
    });
});

//citire soferi
app.get('/soferi', function(request, response){
   Soferi.findAll().then(function(soferi){
       response.status(200).send(soferi);
   }) ;
});

//update sofer dupa id
app.put('/soferi/:id', function(request, response){
   Soferi.findById(request.params.id).then(function(soferi){
       if(soferi){
           soferi.updateAttributes(request.body).then(function(){
               response.status(200).send('updated');
           }).catch(function(error){
              console.warn(error);
              response.status(500).send('server error');
           });
       }else{
           response.status(404).send();
       }
   }) ;
});

//stergere sofer dupa id
app.delete('/soferi/:id', function(request, response){
   Soferi.findById(request.params.id).then(function(soferi){
       if(soferi){
           soferi.destroy().then(function(){
               response.status(204).send();
           }).catch(function(error){
              console.warn(error);
              response.status(500).send('server error');
           });
       }else{
           response.status(404).send();
       }
   }) ;
});