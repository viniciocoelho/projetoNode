module.exports.isLogged = (req, res, next) => {
  if(!req.isAuthenticated()){
    req.flash('error', 'Ops! Você não está logado.')
    res.redirect('/users/login');
    return;
  }  

  next();
};