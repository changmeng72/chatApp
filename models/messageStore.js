const { set } = require("../app");


const store = new Map(); 

function Conversations() {
    this;
}

 



Conversations.newConversation = (peerA, peerB) => {
     
    if (store.has(peerA)) {
        const messagesOfA = store.get(peerA);
        if (!messagesOfA.has(peerB)) {
            const messages = new Array();
            messagesOfA.set(peerB, { unreadNum: 0, messages: messages });
            if (store.has(peerB))
                store.get(peerB).set(peerA, messages);
            else {
                store.set(peerB, new Map());
                store.get(peerB).set(peerA,{ unreadNum: 0, messages: messages })

            }
        }
    } else {
        store.set(peerA, new Map());
        const messages = new Array();
        store.get(peerA).set(peerB, { unreadNum: 0, messages: messages });
        if (store.has(peerB))
            store.get(peerB).set(peerA, { unreadNum: 0, messages: messages });
        else {
            store.set(peerB, new Map());
            store.get(peerB).set(peerA,{ unreadNum: 0, messages: messages })
        }
    }
 
};

       

Conversations.prototype.getAllConversations = (peerA) => {
    const result = [];
    if (store.has(peerA)) {
        const messagesA = store.get(peerA);
        
        for(const [key,value] of messagesA){
            
            const { unreadNum, messages } = value;
            
            const formatMessages = [];
            for (let message of messages) {
                const formatMessage = { datetime: message.datetime, sender: peerA == message.sender ? 0 : 1, text: message.text };
                formatMessages.push(formatMessage);
            }
             
            result.push({ userid: key, messages:formatMessages,unreadNum:unreadNum });
        };
    }
        
    return result;
};



Conversations.prototype.getConversation = (peerA, peerB) => {
    
    if (store.has(peerA) && store.get(peerA).has(peerB)) {
        const conversation = store.get(peerA).get(peerB);
        const formatMessages = [];
        for (let message of conversation.messages) {
                const formatMessage = { datetime: message.datetime, sender: peerA == message.sender ? 0 : 1, text: message.text };
                formatMessages.push(formatMessage);
            }
        
        return{ userid: peerB,messages:formatMessages,unreadNum:conversation.unreadNum  };
    }         
    return null;
};

Conversations.prototype.newMessage = (peerA, peerB,message,unreadB) => {
    Conversations.newConversation(peerA, peerB);
    
    const messages = store.get(peerA).get(peerB).messages;
    messages.push(message);    
    

    
    store.get(peerB).get(peerA).unreadNum += unreadB;
     
    
    

};

Conversations.prototype.resetUnreadNum = (peerA, peerB) => {
    Conversations.newConversation(peerA, peerB);
    
    store.get(peerA).get(peerB).unreadNum = 0; 
    


}
module.exports = new Conversations();
//message: time, senderid ,reiverid, text, read?
 


