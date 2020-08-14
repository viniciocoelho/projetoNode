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
    tags:[String]
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
        { $unwind:'$tags' }
    ]);
}

module.exports = mongoose.model('Post', postSchema);