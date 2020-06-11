var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);    
mongoose.set('useFindAndModify', false);  
mongoose.set('useCreateIndex', true);     
mongoose.set('useUnifiedTopology', true); 
mongoose.connect("mongodb+srv://gktnwls1127:hasujin1104^^@cluster0-6fuda.mongodb.net/test?retryWrites=true&w=majority"); 
var db = mongoose.connection; 
//4
db.once('open', function(){
  console.log('DB connected');
});
//5
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true})); 

// DB schema // 4
var surveySchema = mongoose.Schema({
  gender:{type:String, required:true},
  animal:{type:String, required:true}
});
var Survey = mongoose.model('survey', surveySchema);

// Routes
// Home // 6
app.get('/', function(req, res){
  res.redirect('/contacts/new');
});

// Contacts - Index // 7
app.get('/contacts', async function(req, res){
  let result = [
    await Survey.countDocuments({gender : 'male', animal: 'tiger'}),
    await Survey.countDocuments({gender : 'male', animal: 'elephant'}),
    await Survey.countDocuments({gender : 'female', animal : 'tiger'}),
    await Survey.countDocuments({gender : 'female', animal : 'elephant'})
  ]
    res.render('contacts/index', {contacts:result});

});

// Contacts - New // 8
app.get('/contacts/new', function(req, res){
    res.render('contacts/new');
  });


// Contacts - create // 9
app.post('/contacts', function(req, res){
    Survey.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});


// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
