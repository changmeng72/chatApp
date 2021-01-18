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
    fontWeight: 600,
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
  },
  user: {
    alignItems: "center",

    "&:hover": {
      backgroudColor: "red",
    },
    backgroudColor: "red",
  },
  online: {
    backgroundColor: 'green',
    
  },
   offline: {
    backgroundColor: 'gray',
    
  }
}));


export default function UserCard({ user, selectUser }) {
  const styles = useStyles();
  return (
    <>
      <div className={styles.user}>
        <List>
          <ListItem
            onClick={() => {
              selectUser(user);
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
                  <Avatar alt={user?.username} src={user?.avatar} />
                ) : (
                  <Avatar alt={user?.username} />
                )}
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={<div className={styles.textleftP}>{user?.username}</div>}
              secondary={
                <div className={styles.textleftS}>
                  {user?.lastMessage ? user.lastMessage : ""}
                </div>
              }
            />

            <div className={styles.textRight}>
              {user?.unReadMessages > 0 ? (
                <Badge badgeContent={user?.unReadMessages} color="primary" />
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
