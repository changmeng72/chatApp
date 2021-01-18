const express = require("express");
const apiRouter = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

apiRouter.post('/login', async (req, res) => {
    console.log("login :", req.body.email);

    if (!!req.body.email && !!req.body.passw) {
        const signResult = await User.signIn(req.body.email, req.body.passw);
        if (signResult.result === 'ok') {
            const token = jwt.sign(signResult.user.id, process.env.ACCESS_TOKEN_SECRET);
            req.session.userId = signResult.user.id;
            console.log("userid:",req.session.userId);
            res.status(200).json({ ...signResult, token });

        }
        else {
            res.status(200).json(signResult);
        }
    }
    else
        res.status(400).json({ result: 'nok' })

    
});

apiRouter.post('/signup', async (req, res) => {
     
    
    console.log(req.body.email ,req.body.passw,req.body.username);

    if (!!req.body.email && !!req.body.passw && !!req.body.username) {
        const signResult = await User.signUp(req.body.username, req.body.email, req.body.passw);
        if (signResult.result === 'ok') {
            const token = jwt.sign(signResult.user.id, process.env.ACCESS_TOKEN_SECRET);
            req.session.userId = signResult.user.id;
            res.status(200).json({ ...signResult, token });

        }
        else {
             res.status(200).json(signResult);
        }
    }
    else
        res.status(400).json({ result: 'nok' });

    
});

apiRouter.post('/logout', async (req, res) => {

    req.session.destroy();
    res.json({result:'ok'});   
    
});

apiRouter.get('/token', async (req, res) => {
    try {
         console.log("userid:",req.session.userId);
        if (req.session && req.session.userId) {
            const token = jwt.sign(req.session.userId, process.env.ACCESS_TOKEN_SECRET);
            res.json({ result: 'ok', token });
        } else
            res.json({result:'nok',description:"login  requested!"});
    } catch (err) {
        res.json({ result: 'nok', description: "system failure" });
    }
    
});
apiRouter.get('/users', async (req, res) => {
     
    if (req.session && req.session.userId) {
        const users = await User.getUsers();
        res.json(users);
    } else
        res.json({result:'nok',description:"login  requested!"});
      
    
});

apiRouter.get('/user', async (req, res) => {
    if (req.session && req.session.userId) {
        let user;
         
            user = await User.getUser(req.session.userId);    
            res.json(user);
    }   
    else {
        res.json({result:'nok',description:"login  requested!"});
    }
});

module.exports = apiRouter;