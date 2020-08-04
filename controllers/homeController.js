const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (req, res)=>{
    let obj = {
       pageTitle: 'HOME',   
       posts:[]    
    };

    const posts = await Post.find(); // busca todos os posts no mongoDB
    obj.posts = posts;


    res.render('home', obj);
};  