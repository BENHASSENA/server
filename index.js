const { response } = require('express');
const express = require ('express');
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const mongoose = require ('mongoose');
const userRoutes = require ('./routes/user.routes');

// DB CONNECTION
// TODO : Ajouter la connexion dans un fichier séparé qui servira de module de connexion
mongoose.connect('mongodb://localhost/jwt_auth',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, ()=>{
    console.log('connected to MongoDB');
});

// TODO : Créer un fichier .env qui contient les variables d'environnement comme l'URL de connexion à la base de donnée, le port d'écoute.
const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin:['http://localhost:8000','http/locahost:3000', 'http/locahost:4200', 'http://localhost:8080']
}));
app.use(express.json());

// ROUTES
// app.get ('/', (req,res)=>{
//     res.send('Hello there !');
// });
app.use('/api/user', userRoutes);

app.listen(8000);

