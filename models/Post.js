const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    photo:String,
    title:{
        type:String,
        trim:true,
        required:'Precisa de um título'
    },
    slug:String,
    body:{
        type:String,
        trim:true
    },
    tags:[String],
    author: mongoose.Schema.Types.ObjectId
});

postSchema.pre('save', async function(next) {
    if(this.isModified('title')) {
        this.slug = slug(this.title, {lower:true});

        // acesso ao BD pra verifica se o slug já existe
        // expressão regular = REGEX (regular expression)
        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');

        const postsWithSlug = await this.constructor.find({slug:slugRegex});

        if(postsWithSlug.length > 0) {
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
        }

    }

    next();   
});

postSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind:'$tags' }, //separando os posts por tags
        { $group: { _id:'$tags', count:{ $sum:1}}}, //somando as tags iguais separadamente
        { $sort:{ count:-1 }}

    ]);
};

postSchema.statics.findPosts = function(filters = {}) {
    return this.aggregate([
        { $match: filters },
        { $lookup: {
            from:'users',
            let:{ 'author':'$author'},
            pipeline:[
                { $match: { $expr:{ $eq:[ '$$author', '$_id']}}},
                { $limit: 1}
            ],
            as:'author'
        } },
        { $addFields: {
            'author': { $arrayElemAt: [ '$author', 0]}
        } }
    ]);
}

module.exports = mongoose.model('Post', postSchema);