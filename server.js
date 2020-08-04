const mongoose = require('mongoose');

require('dotenv').config({path:'variables.env'});

// Conexão ao Banco de Dados
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false //necessário pra pode usar o findOneAndUpdate
 });

//Essa afirmação afirma pro mongoose que ele pode usar o ecmascript 6
mongoose.Promise = global.Promise;

//Mensagem de erro, caso aconteça
mongoose.connection.on('error', (error) => {
    console.error("ERRO: "+error.message)
});

// Carregando todos os models
require('./models/Post');

const app = require('./app');

//determina a porta que eu vou usar
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
    console.log("Servidor está rodando na porta: "+ server.address().port);
});

