const mongoose = require('mongoose');
const slug = require('slug');
const Post = mongoose.model('Post');

exports.view = async (req, res) => {
    const post = await Post.findOne({ slug:req.params.slug });
    res.render('view', { post }); 
    
};

exports.add = (req, res) => {
    res.render('postAdd')
}; 

exports.addAction = async (req, res) => {
    req.body.tags = req.body.tags.split(',').map(t => t.trim());
    //associa o post ao autor
    req.body.author = req.user._id;
    // o split é usado para separar as tegs. map é utilizado para gerar um novo array mas sem espaço entre os elementos.
    const post = new Post(req.body);
   
   try {
        await post.save();
   } catch(error) {
       req.flash('error', 'Erro: '+error.message);
       return res.redirect('/post/add');
   };

    req.flash('success', 'Post salvo com sucesso');
    res.redirect('/');
}; 

exports.edit = async (req, res) => {
    const post = await Post.findOne({ slug:req.params.slug });
    res.render('postEdit', { post }); 
}; 

exports.editAction = async (req, res) => {
    req.body.slug = require('slug')(req.body.title, {lower:true});
    req.body.tags = req.body.tags.split(',').map(t => t.trim());
    try {
        const post = await Post.findOneAndUpdate(
            { slug:req.params.slug },
            req.body,
            {
                new:true, //retorna um novo item atualizado
                runValidators:true
            }
    );
} catch(error){
    req.flash('error', 'Ocorreu um erro. Tente novamente.');
    return res.redirect('/post/'+req.params.slug+'/edit');
};
    req.flash('success', 'Post atualizado com sucesso');
    res.redirect('/');      
};   