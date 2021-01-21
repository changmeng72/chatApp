import socketIOClient from "socket.io-client";
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Button,
  Paper,
} from "@material-ui/core";
import { useState, useEffect, useCallback } from "react";

import UserList from "../components/UserList";
import ChatBox from "../components/ChatBox";
import { useRouter } from "next/router";

import postData from "../utils/postData";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 600,
    width: 900,
    marginTop: 30,
  },
  userlist: {
    width: 340,
    padding: " 0 0px 5px 5px",
  },
  chat: {
    width: "100%",
    padding: " 0 0px 5px 5px",
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
      const res = await fetch("/api/user?username=" + userName, []);
      const json = await res.json();

      if (json.result === "ok") {
        const newUsers = [
          ...users,
          { ...json.user, messages: [], lastMessage: "", unReadMessages: 0 },
        ];
        setUsers(() => {
          return newUsers;
        });
        setPeer(json.user);
        //selectUser(()=>json.user);
      } else if (json.description === "login  requested!")
        router.replace("/login");
      else {
        alert(json.description || "Failed to find the user");
      }
    } catch (err) {
      alert("Failed to find the user" + err);
    }
  }

  // user click on the userlist

  function selectUser(user) {
    setPeer(user);

    //update unreadMessages number
    const newUsers = users.map((u) => {
      if (user._id === u._id) {
        return { ...u, unReadMessages: 0 };
      } else return u;
    });
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

    socket2.on("connect", () => {});
    socket2.on("message", (data) => {
      setNewMessage(data);
    });
    socket2.on("disconnect", () => {});
    socket2.on("status", (data) => {
      
      setUserStatus(() => data);
    });
    setSocket(socket2);
    
    return () => {
      socket2.close();
      
    };
  }, []);

  if (!user) return <>Loading...</>;
  else
    return (
      <>
        <CssBaseline>
          <Container className={styles.root}>
            <Paper className={styles.full}>
              <Box display="flex" className={styles.full}>
                <Box className={styles.userlist}>
                  <UserList
                    users={users}
                    user={user}
                    selectUser={selectUser}
                    searchUser={searchUser}
                    logout={logout}
                  />
                </Box>
                <Box item className={styles.chat}>
                  <ChatBox
                    user={user}
                    peer={peer}
                    sendMessage={sendMessage}
                    users={users}
                  />
                </Box>
              </Box>
            </Paper>
          </Container>
        </CssBaseline>
      </>
    );
}
