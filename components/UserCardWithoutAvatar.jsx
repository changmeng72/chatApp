import { Box, Badge, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    width: "100%",
  },

  textLeft: {
    paddingRight: "20px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 700,
    fontSize: "16px",
  },
 
  normalDistance: {
    marginRight: "10px",
  },
  online: {
    width: "14px",
    height: "14px",
    backgroundColor: "rgb(28, 237, 132)",
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: "50%",
  },
  offline: {
    backgroundColor: "rgb(208, 218, 233)",
    width: "14px",
    height: "14px",
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: "50%",
  },
  textStatus: {
    color: "rgb(208, 218, 233)",
    fontSize: "18px",
  },
}));

export default function UserCardWithOutAvatar({ user, hideUserList }) {
  const styles = useStyles();
  return (
    <>
      <Box className={styles.textLeft}>{user?.username}</Box>
      <Box className={styles.normalDistance}>
        <Badge
          badgeContent=""
          classes={{
            badge: user?.status === "online" ? styles.online : styles.offline,
          }}
          variant="dot"
        />
      </Box>
      <Box className={styles.textStatus}>{user?.status}</Box>
      
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
