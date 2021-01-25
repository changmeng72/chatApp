const express = require("express");
const apiRouter = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const UserStatus = require("../models/userStatus");
const Conversations = require("../models/messageStore");
const  auth=() => {
    return (req, res, next) => {
        if (req.session && req.session.userId)
            next();
        else {
            res.status(401).json({ result: 'nok', description: "login  requested!" });
        }
    }
}
apiRouter.post('/login', async (req, res) => {
    

    if (!!req.body.email && !!req.body.passw) {
        const signResult = await User.signIn(req.body.email, req.body.passw);
        if (signResult.result === 'ok') {
            const token = jwt.sign(signResult.user.id, process.env.ACCESS_TOKEN_SECRET);
            req.session.userId = signResult.user.id;
            
            res.status(signResult.resCode).json({ ...signResult, token });

        }
        else {
            res.status(signResult.resCode).json(signResult);
        }
    }
    else
        res.status(400).json({ result: 'nok' })

    
});

apiRouter.post('/signup', async (req, res) => {
     
    
    

    if (!!req.body.email && !!req.body.passw && !!req.body.username && req.body.passw.length>=6) {
        const signResult = await User.signUp(req.body.username, req.body.email, req.body.passw);
        if (signResult.result === 'ok') {
            const token = jwt.sign(signResult.user.id, process.env.ACCESS_TOKEN_SECRET);
            req.session.userId = signResult.user.id;
            res.status(201).json({ ...signResult, token });

        }
        else {
             res.status(signResult.resCode).json(signResult);
        }
    }
    else
        res.status(400).json({ result: 'nok' });

    
});

apiRouter.post('/logout',auth(), async (req, res) => {

    req.session.destroy();
    res.json({result:'ok'});   
    
});

apiRouter.get('/token',auth(), async (req, res) => {
    try {
         
       // if (req.session && req.session.userId) {
            const token = jwt.sign(req.session.userId, process.env.ACCESS_TOKEN_SECRET);
            res.json({ result: 'ok', token });
      //  } else
        //    res.json({result:'nok',description:"login  requested!"});
    } catch (err) {
        res.status(500).json({ result: 'nok', description: "system failure" });
    }
    
});
apiRouter.get('/users', auth(), async (req, res) => {
     
    try {
        let users;
        console.log("username:",req.query.username);
        if (req.query && req.query.username)
            users = await User.getUsersByName(req.query.username);
        else
            users = await User.getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({result:'nok',description:'system failure'});
    }
      
    
});
 

apiRouter.get('/user',auth(), async (req, res) => {
    try {
        let user;
        if (req.query && req.query.username) {
           
            user = await User.getUserByName(req.query.username);
            
        } else {
            
            user = await User.getUser(req.session.userId);            
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({result:'nok',description:'system failure'});
    }
    
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
apiRouter.post('/peer',auth(), async (req, res) => {
    if (req.body && req.body.peerid) {
        UserStatus.setPeer(req.session.userId, req.body.peerid);
        Conversations.resetUnreadNum(req.session.userId,req.body.peerid);
        res.status(200).json({ result: 'ok', description: 'peer update' });
    } else
        res.status(400).json({ result: 'nok', description: 'missing parameter' });
    
    
    
});
apiRouter.get('/conversations', auth(), async (req, res) => {
    const conversations = Conversations.getAllConversations(req.session.userId)
    const result = [];
    try {
        for (let conversation of conversations) {
            const user = await User.getUser(conversation.userid);
            
            if (user.result == 'ok') {
                let lastMessage = '';
                for (let message of conversation.messages) {
                    if (message.sender == 1)
                        lastMessage = message.text;
                }
                result.push({ ...user.user._doc, messages: conversation.messages, unReadMessages: conversation.unreadNum,lastMessage:lastMessage });
            }
        }

     
        res.status(200).json({ result: 'ok', users: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({result:'nok',description:"system failure"});
    }
    
});
//? peerId=
apiRouter.get('/conversation', auth(), async (req, res) => {
   
    const userId = req.session.userId;
    const peerId = req.query.peerId;     
    
    const conversation = Conversations.getConversation(userId, peerId);
    if (conversation) {
        for (let message of conversation.messages) {
            if (message.sender == 1)
                lastMessage = message.text;
        }
        try {
            const user = await User.getUser(conversation.userid);
            res.status(200).json({ result: 'ok', user: { ...user.user._doc, messages: conversation.messages, unReadMessages: conversation.unreadNum, lastMessage: lastMessage } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ result: 'nok', description: "system failure" });
        }
    } else {
         console.error("not found ");
         res.status(400).json({ result: 'nok', description: "no data found" });
    }
    
});
 
module.exports = apiRouter;