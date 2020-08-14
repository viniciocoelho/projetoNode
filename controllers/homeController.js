const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (req, res)=>{
    let responseJson = {
       pageTitle: 'HOME',   
       posts:[],
       tags:[]    
    };

    const tags = await Post.getTagsList();
    responseJson.tags = tags;


    const posts = await Post.find(); // busca todos os posts no mongoDB
    responseJson.posts = posts;


    res.render('home', responseJson); 
}; 