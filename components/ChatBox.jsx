import { Paper, Box, List } from "@material-ui/core";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";

import { makeStyles } from "@material-ui/core/styles";
import UserCardWithOutAvatar from "./UserCardWithOutAvatar";
import IconButton from "@material-ui/core/IconButton";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
  },
  userBox: {
    width: "100%",
    height: "104px",
    minHeight: "104px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "6px",
    paddingLeft: "16px",
    boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
  },
  chatarea: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    marginLeft: "20px",
    marginRight: "20px",
  },

  chatpad: {
    flexGrow: 1,

    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  btnRight: {
    clear: "both",
    float: "right",
    clear: "both",
    color: "rgb(208, 218, 233)",
   
    },
    growright: {
       flexGrow: "1",
    paddingRight: "15px",
    },
    showWhenSmall: {
        display:'none',
        [theme.breakpoints.down('xs')]: {
            display:'inline'
        }
    }
}));

export default function ChatBox({
  user,
  peer,
  messages,
  sendMessage,
  users,
  hideUserList,
}) {
  const styles = useStyles();

  return (
    <>
      <Box className={styles.root}>
        <Box className={styles.userBox}>
          <UserCardWithOutAvatar user={peer} />
          <Box className={styles.growright}>
            <Box className={styles.btnRight}>
              <IconButton size={"small"}>
                <MoreHoriz />
              </IconButton>
              <IconButton size={"small"} onClick={() => hideUserList(false)} className={styles.showWhenSmall}>
                <MenuRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box className={styles.chatarea}>
          <Box className={styles.chatpad}>
            <MessageBox peer={peer} users={users} />
          </Box>
          <Box>
            <MessageInput sendMessage={sendMessage} peer={peer} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
