const User = require('../models/User');

exports.login = (req, res) => {
    res.render('login');
};

exports.register = (req, res) => {
    res.render('register');
};

exports.registerAction = (req, res) => {
    User.register(new User(req.body), req.body.password, (error)=>{
        if(error) {
            console.log('Erro ao registrar', erro);
            res.redirect('/');
            return;
        }

        res.redirect('/');
    });
};