import {
  Grid,
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  List, 
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors"

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: -10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  textleftP: {
    clear: "both",
    float: "left",
    clear: "both",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 700,
    fontSize: "12px",
  },
  textleftS: {
    clear: "both",
    float: "left",
    clear: "both",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 400,
    fontSize: "8px",
  },
  textRight: {
    clear: "both",
    float: "right",
    clear: "both",
    color: 'rgb(208, 218, 233)'
  },
  userCard: {
     
    "&:hover": {
        
      backgroundColor: 'white',
    },
    
  },
  online: {
    width: '14px',
    height:'14px',
    backgroundColor: 'rgb(28, 237, 132)',
    right: 14,
    top: 43,
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius:'50%'
    
    
  },
   offline: {
     backgroundColor: 'rgb(208, 218, 233)',
     width: '14px',
    height:'14px',
     
    right: 11,
    top: 35,
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius:'50%'
    
    
  },
   
  bigAvatar: {
    margin: theme.spacing(1),
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  unread: {
   backgroundColor: 'rgb(58, 141, 255)',
  }
}));


export default function UserCard({ user, selectUser, inList,hideUserList }) {
  const styles = useStyles();  
  return (
    <>
      <div  >
        <List>
          <ListItem
             button = {inList}
            classes={inList?{root:styles.userCard}:{}}
            onClick={() => {
              if (inList) {
                selectUser(user);
                hideUserList(true);
              }
            }}
          >
            <ListItemAvatar>
              <Badge
                classes={{badge: user?.status==='online'?styles.online:styles.offline}}
                badgeContent=" "
                variant="dot"
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                {user && user.avatar ? (
                  <Avatar alt={user?.username} src={user?.avatar}  className={styles.bigAvatar} />
                ) : (
                  <Avatar alt={user?.username} className={styles.bigAvatar}/>
                )}
              </Badge>
            </ListItemAvatar >
            <ListItemText
              primary={<span className={styles.textleftP}>{user?.username}</span>}
              secondary={
                <span className={styles.textleftS}>
                  {user?.lastMessage ? (user.lastMessage.length>20 ? user.lastMessage.slice(0,20) + "...": user.lastMessage) : ""}
                </span>
              }
            />

            <div className={styles.textRight}>
              {user?.unReadMessages > 0 ? (
                <Badge badgeContent={user?.unReadMessages} color = "primary" />
              ) : (
                ""
              )}
            </div>
          </ListItem>
        </List>
      </div>
    </>
  );
}

/*
<Grid container>
                <Grid item>
                    {user.avatar ? <Avatar className={classes.orange}>N</Avatar> :
                    <Avatar alt="Remy Sharp" src={user.avatar} />}
                </Grid>
                <Grid item>
                    {user.username}
                </Grid>
                <Grid item>
                    {user.messages?.length}
                </Grid>
           </Grid>
*/
