const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createUser, updateUser, deleteUser, showUsers, getUserInfos } = require('./controllers/usuariosController');
const login = require('./controllers/login');
const authenticateUser = require('./middlewares/authetication');
const { createModule, updateModule, deleteModule, showModules, getModuleInfos } = require('./controllers/modulosController');
const { createProfile, updateProfile, deleteProfile, showProfiles } = require('./controllers/perfisControllers');
const { createTransaction, updateTransaction, deleteTransaction } = require('./controllers/transacoesController');
const { createFunction, updateFunction, deleteFunction } = require('./controllers/funcoesController');

const app = express();
const PORT = 3000;
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // Permite acesso do cliente em http://localhost:8080
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); // Loga o erro no console
    res.status(500).send('Algo deu errado!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

//app.use(authenticateUser);
app.post('/login', login);
app.post('/user', createUser);
app.put('/user/:id_usuario', updateUser);
app.delete('/user/:id_usuario', deleteUser);
app.get('/user/:id_usuario', getUserInfos);
app.get('/users', showUsers);
app.post('/profile', createProfile);
app.put('/profile/:id_perfil', updateProfile);
app.delete('/profile/:id_perfil', deleteProfile);
app.get('/profiles', showProfiles);
app.post('/module', createModule);
app.put('/module/:id_modulo', updateModule);
app.delete('/module/:id_modulo', deleteModule);
app.get('/module/:id_modulo', getModuleInfos);
app.get('/modules', showModules);
app.post('/transaction', createTransaction);
app.put('/transaction/:id_transacao', updateTransaction);
app.delete('/transaction/:id_transacao', deleteTransaction);
app.post('/function', createFunction);
app.put('/function/:id_funcao', updateFunction);
app.delete('/function/:id_funcao', deleteFunction);

