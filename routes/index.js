const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const imageMiddleware = require('../middlewares/imageMiddleware');

const router = express.Router();
router.get('/', homeController.index);
router.get('/users/login', userController.login);
router.get('/users/register', userController.register);

//Adição
router.get('/post/add', postController.add);
router.post('/post/add',
    imageMiddleware.upload,
    imageMiddleware.resize,    
    postController.addAction
); 

//Edição
router.get('/post/:slug/edit', postController.edit);
router.post('/post/:slug/edit', postController.editAction);

//Visualização
router.get('/post/:slug', postController.view);
 

module.exports = router;  
      
 
      