const express = require('express');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(express.static(__dirname + '/public'));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUnitalized:false
}));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    next();
});

app.use('/', router);  

app.use(errorHandler.notFound);

//Config do Mustache
app.engine('mst', mustache(__dirname+'/views/partials', '.mst')); //aqui defino a extensão do arquivo visual
app.set('view engine', 'mst'); //define pra que serve. no caso é o motor de visualização
app.set('views', __dirname + '/views'); //define o diretorio de onde o mustache vai buscar as paginas

module.exports = app;

 