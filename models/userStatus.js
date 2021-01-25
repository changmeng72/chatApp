 

 
  
const userStatus = new Map();

function UserStatus() {
    
}

UserStatus.prototype.getUser = (userid) => {
    if ( userStatus.has(userid)) return  userStatus.get(userid);
    else return null;
};

UserStatus.prototype.onLine = (userid) => {
   
    if ( userStatus.has(userid)) {
         userStatus.get(userid).status = 'online'; 
    } else {
         userStatus.set(userid, { status: 'online', peer: null });
    }        
};

UserStatus.prototype.isOnline = (userid)=>{
     if ( userStatus.has(userid)) {
        return userStatus.get(userid).status == 'online'; 
    } else {
        return false;
    }        
};

UserStatus.prototype.offLine = (userid) => {
    
    if ( userStatus.has(userid)){
        userStatus.get(userid).status = 'offline'; 
    } else {
        userStatus.set(userid,  { status: 'onffline', peer: null });
    }   
};

UserStatus.prototype.setPeer = (userid, peerid)=>{
    if (userStatus.has(userid)) {
        const status = userStatus.get(userid);
        status.peer = peerid;
        status.status = 'online';
    }
    if (!userStatus.has(peerid))
        userStatus.set(peerid, { status: 'offline', peer: null });
    
    
    
};
UserStatus.prototype.getPeer = (userid) => {
   if (userStatus.has(userid)) {
        return userStatus.get(userid).peer;
    }
    else return null;
};
 
module.exports =  new UserStatus();


