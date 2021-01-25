import socketIOClient from "socket.io-client";
import { useMediaQuery,  Box,  Container,  CssBaseline,  Paper,} from "@material-ui/core";
import { useState, useEffect } from "react";

import UserList from "../components/UserList";
import ChatBox from "../components/ChatBox";
import { useRouter } from "next/router";

import postData from "../utils/postData";

import { makeStyles } from "@material-ui/core/styles";
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

const useStyles = makeStyles((theme) => ({
   
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',

    
  },
  paper: {
    marginTop:"10px",
    height: "calc(100vh - 15px)",
    width: "100%",
  },
  userlist: {
    minWidth: 320,
    padding: " 0 0px 0px 0px",     
    height: "calc(100vh - 15px)",
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      zIndex: 100,
      position: 'absolute'
      
    }
  },
  userlistHide: {
     display: 'none'
     
  },
  chat: {
    flexGrow:1,
     
    padding: " 0 0px 5px 5px",
    height: "calc(100vh - 15px)",
  },
  full: {
    height: "100%",
    width: "100%",
    
  },
}));

export default function Chat() {
  const styles = useStyles();
  const [newMessage, setNewMessage] = useState("");
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [logoutStatus, setLogoutStatus] = useState(false);
  const [hideSideBar, setHideSideBar] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState(null);
  
  const matches = useMediaQuery("(max-width:600px)");

  const router = useRouter();
  useEffect(() => {
    if (logoutStatus === true) {
      
      socket?.close();
      router.push("/login");
    }
  }, [logoutStatus]);
  const logout = () => {
    
    setLogoutStatus(true);
  };
  async function searchUser(userName) {
    try {
      const res = await fetch("/api/users?username=" + userName, []);
      const json = await res.json();

      if (json.result === "ok") {
         
        console.log("search result:",json.users);
         const newUsers = json.users.map((u) => {
           
             return { ...u, messages: [], lastMessage: "", unReadMessages: 0 };
          
        });
         
        setSearchedUsers(newUsers);

      } else if (json.description === "login  requested!")
        router.replace("/login");
      else {
        alert(json.description || "Failed to find the user");
      }
    } catch (err) {
      alert("Failed to find the user" + err);
    }
  }

  // user click on the userlist or searchresult list

  function selectUser(user) {
    setPeer(user);

    //update unreadMessages number
    let found = false;
    let newUsers;
      for (let i = 0; i < users.length; i++){
        if (users[i]._id === user._id) {
          found = true;          
        }      
    }
    if (found) {
      newUsers = users.map((u) => {
        if (user._id === u._id) {
          return { ...u, unReadMessages: 0 };
        } else return u;
      });
    } else {
      newUsers = [...users, user];
    }
    setUsers(() => newUsers);
    /**update server side conversation status 20210120 */
    postData("/api/peer", { peerid: user._id });
  }

  ///send out chat message
  function sendMessage(text) {
    //console.log({ sender: user._id, receivers: [peer._id], text: text });
    socket.emit("message", {
      sender: user._id,
      receivers: [peer._id],
      text: text,
    });
    //record message
    /*
    const newUsers = users.map((u) => {
      if (u._id === peer._id) {
        const date = new Date();

        return {
          ...u,
          messages: [
            ...u.messages,
            { datetime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false }), sender: 0, text: text },
          ],
        };
      } else return u;
    });
    setUsers(() => newUsers);*/
    // console.log(users);
  }





  
  /// receive status message
  useEffect(() => {
    if (userStatus !== null) {
      const { sender, status } = userStatus;
      if (user._id === sender) {
        const newUser = { ...user, status };
        setUser(newUser);
      }
      else {
        if (users.length > 0) {
          const newUsers = users.map((u) => {
            if (u._id === sender) return { ...u, status };
            else return u;
          });
          //console.log("statuschange:", newUsers);
          setUsers(() => newUsers);
        }
        if (peer?._id === sender)
          setPeer(() => {
            return { ...peer, status };
          });
      }
    }
  }, [userStatus]);

  //receive new message

  useEffect(async () => {
    const found = users?.filter((u) => u._id == newMessage.sender);

    if (found.length == 0 && user?._id != newMessage.sender) {
      const res = await fetch("/api/conversation?peerId=" + newMessage.sender, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.result === "ok") {
        setUsers(() => [...users, json.user]);
      }
    } else {
      //from self or from existing conversation

      const newUsers = users.map((u) => {
        if (u._id === newMessage.sender || u._id === newMessage.receivers[0]) {
          let unReadMessages = 0;
          if (
            peer?._id === newMessage.sender ||
            peer?._id === newMessage.receivers[0]
          )
            unReadMessages = 0;
          else unReadMessages = u.unReadMessages + 1;
          const senderFlag = u._id === newMessage.sender ? 1 : 0;
          return {
            ...u,
            messages: [
              ...u.messages,
              {
                datetime: newMessage.datetime,
                sender: senderFlag,
                text: newMessage.text,
              },
            ],
            lastMessage:
              newMessage.sender !== user._id ? newMessage.text : u.lastMessage,
            unReadMessages,
          };
        } else return u;
      });

      setUsers(() => newUsers);
    }
    //console.log(users);
  }, [newMessage]);

  //INITIAL DATA ,CLIENT SIDE RENDER
  useEffect(async () => {
    let tempToken;
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/token", { credentials: "include" });
        const json = await res.json();

        if (json.result === "ok") {
          tempToken = json.token;
          return true;
        } else if (json.description === "login  requested!") {
          /*NOT LOGIN*/
          router.replace("/login");
          return false;
        }
      } catch (err) {
        console.error(err);
      }
      return false;
    };

    let result = await fetchToken();
    if (result === false) return;
    //get user info
    let tempuser = user;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", []);
        const json = await res.json();
        if (json.result === "ok") {
          setUser({ ...json.user, status: "online" });
          tempuser = json.user;
          return true;
        } else if (json.description === "login  requested!")
          router.replace("/login");
      } catch (err) {
        console.error(err);
      }
      return false;
    };

    result = await fetchUser();
    if (result === false) return;
    //get users info. here we assume all users belong to same group, and we load them in a batch

    /*
      const fetchUsers = async () => {
        try {
           
          const res = await fetch("/api/users", []);
          const json = await res.json();
          if (json.result === "ok") {
            const newUsers = json.users.filter((u) => u._id !== tempuser._id);
            setUsers(
              newUsers.map((u) => {
                return {
                  ...u,
                  messages: [],
                  lastMessage: "",
                  unReadMessages: 0,
                };
              })
            );
             
          } else if (json.description === "login  requested!") {
            //setLogedIn(false);
            console.error(" Users: fails");
            router.replace("/login");
          } else {
            
            console.error(" Users: fails");
          }
        } catch (err) {          
          console.error(" Users: errr:", err);
        }
      };
     result =  await fetchUsers();
    if (result === false) return;*/
    // fetch conversations
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations", []);
        const json = await res.json();
        if (json.result === "ok") {
          setUsers(json.users);
        } else if (json.description === "login  requested!") {
          //setLogedIn(false);
          console.error(" Users: fails");
          router.replace("/login");
        } else {
          console.error(" get conversations: fails");
        }
      } catch (err) {
        console.error(" Users: errr:", err);
      }
    };
    result = await fetchConversations();
    if (result === false) return;

    //create chat socket

    const socket2 = socketIOClient("/", { query: { token: tempToken } });

    socket2.on("connect", () => {

       setUserStatus(() => { return { sender: tempuser._id, status: "online" }; });

    });
    socket2.on("message", (data) => {
      setNewMessage(data);
    });
    socket2.on("disconnect", () => {
      setUserStatus(() => { return { sender: tempuser._id, status: "offline" }; });
      });
    socket2.on("status", (data) => {
      
      setUserStatus(() => data);
    });
    setSocket(socket2);
    
    return () => {
      console.log("chat unmount");
      socket2.close();
      
    };
  }, []);


  function hideUserList(hide) {
    if(matches)
    setHideSideBar(hide);
  }

  if (!user) return <>Loading...</>;
  else
    return (
      <>
        <CssBaseline>
          <Container maxWidth="lg">
            <Paper className={styles.paper} elevation={matches?0:3}>
              <Box className={styles.root}>
                <Box className={hideSideBar? styles.userlistHide:styles.userlist}>


                  <UserList
                    users={users}
                    user={user}
                    selectUser={selectUser}
                    searchUser={searchUser}
                    logout={logout}                     
                    peer={peer}
                    searchedUsers={searchedUsers}
                    hideUserList = {hideUserList}
                    
                  />
                </Box>
                <Box  className={styles.chat}>
                  <ChatBox
                    user={user}
                    peer={peer}
                    sendMessage={sendMessage}
                    users={users}
                    hideUserList = {hideUserList}
                  />
                </Box>
              </Box>
            </Paper>
          </Container>
        </CssBaseline>
      </>
    );
}
