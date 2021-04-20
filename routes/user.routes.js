const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const Folder = require('../models/folder.model');

// cette route ne sert que pour démarrer au début du projet
// router.get('/', async (req,res)=>{
//     res.send('Hello from user');
// })  

//Route qui créé un utilisateur
router.post('/register', async (req,res)=>{

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })

    // 
    const result = await user.save()
    // On décompose l'objet
    const {password, ...data} = await result.toJSON()

    // On retourne data
    res.send(data);

})

//Route de connexion 
router.post('/connexion', async (req,res)=>{
    // 1-je vérifie que l'utilisateur possède cette adresse
    const user = await User.findOne({email:req.body.email});

    if(!user){ 
        return res.status(404).send({
            message: 'Utilisateur non trouvé'
        })
    }

    // 2-je vérifie que le mot de passe est valide (sinon il retourne un message d'erreur)
    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.status(404).send({
            message: "informations d'identification invalides"
        })
    }

    // 3-je créé un token de session pour l'utilisateur

    const token = jwt.sign({_id:user._id}, "secret");

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24*60*60*1000 //= 1 jour en millisecondes 
    })


    res.send(user);


});

//Route qui récupere les infos de l'utilisateur
router.post('/', async (req,res)=>{

    try{
        const cookie = req.cookies['jwt']
        const claims = await jwt.verify(cookie, 'secret');

        if(!claims){
            return res.status(401).send({
                message: "Pas authentifié"
            })
        }
        const user = await User.findOne({_id:claims._id});
        const {password, ...data} = await user.toJSON()

        res.send(data);
    }
    catch (error){
        return res.status(404).send({
            message: "Pas authentifié"
        })
    }
    
});

//Route de deconnexion
router.post('/logout', async (req,res)=>{
    res.cookie('jwt', '', {maxAge:0})

    res.send({
        message:'Vous êtes bien déconnecté'
    })
    
})

//Route ajouter un dossier
router.post('/addfolder', async (req,res)=>{
    const folder = await new Folder({
        userId: req.body.user_id,
        nameFolder: req.body.nameFolder,
    })
    const result = await folder.save()
    res.send(result.toJSON())
})

//Route qui récupère les dossier de l'utilisateur
router.post('/userfolder', async (req,res)=>{
    const folders = await Folder.find({userId:req.body.id});
    res.send(folders)
})

//Route pour supprimer un dossier

router.delete('folder/delete/:id', (req,res)=>{

    try {
        Folder.deleteOne({_id: req.params.id})
        .then(res.json({message: "bien effacé"}))
    } catch (error) {
        return res.json({message: error})
    }
})

//Route ajouter une tache
router.post('/addtask', async (req,res)=>{
    const task = await new Task({
        userId: req.body.user_id,
        nameTask: req.body.nameTask,
        priorityTask: req.body.priorityTask,
        timeEstimateTask: req.body.timeEstimateTask,
        timeRealTask: req.body.timeRealTask,
        echeanceTask: req.body.echeanceTask,
        rappelTask: req.body.rappelTask,
        folderId: req.body.folderId,
    })
    const result = await task.save()
    res.send(result.toJSON())
})

//Route qui récupère les taches de l'utilisateur
router.post('/usertask', async (req,res)=>{
    const tasks = await Task.find({userId:req.body.id});
    res.send(tasks)
})

//Route pour supprimer une tache
router.delete('/task/delete/:id', (req,res)=>{
    try {
        Task.deleteOne({_id: req.params.id})
        .then(res.json({message: "bien effacé"}))
    } catch (error) {
        return res.json({message: error})
    }
})

//Route pour mettre à jour une tache
router.post('/updateTask', (req,res)=>{
    try {
        Task.updateOne(
           { "_id" : req.body.idtache},
           { $set: { 
               "nameTask" : req.body.nameTask,
               "priorityTask" : req.body.priorityTask,
               "timeEstimateTask" : req.body.timeEstimateTask,
               "timeRealTask" : req.body.timeRealTask,
               "echeanceTask" : req.body.echeanceTask,
               "rappelTask" : req.body.rappelTask,
               "folderId": req.body.folderId,
            } }
        )
        .then(res.json({message: "bien modifié", value:req.body}))

     } catch (e) {
        return res.json({message: error, value:req.body})
    
     }
})
//Route pour mettre à jour un dossier
router.post('/updateFolder', (req,res)=>{

    try {
        Folder.updateOne(
           { "_id" : req.body.idfolder},
           { $set: { 
               "nameFolder" : req.body.nameFolder,
            } }
        )
        .then(res.json({message: "bien modifié", value:req.body}))

     } catch (e) {
        return res.json({message: error, value:req.body})
    
     }
})


module.exports = router;