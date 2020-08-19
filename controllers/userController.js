const User = require('../models/User');

exports.login = (req, res) => {
    res.render('login');
};

exports.loginAction = (req, res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result) =>{
        if(!result) {
            req.flash('error', 'Seu email e senha estão errados!');
            res.redirect('/users/login');
            return;
        }

        req.flash('success', 'Você foi logado com sucesso!');
        res.redirect('/');
    });
};

exports.register = (req, res) => {
    res.render('register');
};

exports.registerAction = (req, res) => {
    User.register(new User(req.body), req.body.password, (error)=>{
        if(error) {
            req.flash('error', 'Ocorreu um erro temte mais tarde.');
            res.redirect('/users/register');
            return;
        }

        req.flash('success', 'Registro efetuado com sucesso. Faça seu login.');
        res.redirect('/users/login');
    });
};