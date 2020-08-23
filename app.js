const express = require('express');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

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

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    res.locals.h = { ...helpers }; // {... XXXX} essa notação passa os valores de helpers (menus) para o h, não afetando o filtro abaixo.
    res.locals.flashes = req.flash();
    res.locals.user = req.user;
    
    // Filtro dos menus conforme a situção do usuário (logado ou não) 
    if(req.isAuthenticated()) {
        // filtrar menu para guest ou logged
        res.locals.h.menu = res.locals.h.menu.filter(i => (i.logged));

    } else {
        // filtrar menu para guest
        res.locals.h.menu = res.locals.h.menu.filter(i => i.guest);
    }

    next(); 
}); 

const User = require('./models/User');
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', router);  

app.use(errorHandler.notFound);

//Config do Mustache
app.engine('mst', mustache(__dirname+'/views/partials', '.mst')); //aqui defino a extensão do arquivo visual
app.set('view engine', 'mst'); //define pra que serve. no caso é o motor de visualização
app.set('views', __dirname + '/views'); //define o diretorio de onde o mustache vai buscar as paginas

module.exports = app;

 