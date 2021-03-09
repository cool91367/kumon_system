var mongoose = require('mongoose');
var credential = require('../config/credential/credential');

try{
    mongoose.connect(credential.mongodbUri, {useNewUrlParser: true, useUnifiedTopology: true});
}catch(err){
    console.log("db connection error:", err);
}
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);