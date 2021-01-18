import { Box, Badge, Typography, Paper } from "@material-ui/core";
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
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  textLeft: {
    paddingRight: "20px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 600,
    fontSize: "14px",
  },
  textRight: {
    clear: "both",
    float: "right",
    clear: "both",
  },
  normalDistance: {
    marginRight: "10px",
    },
   online: {
    backgroundColor: 'green',
    
  },
   offline: {
    backgroundColor: 'gray',
    
  }
}));

export default function UserCardWithOutAvatar({ user }) {
  const styles = useStyles();
  return (
    <>
      <Box className={styles.textLeft}>{user?.username}</Box>
      <Box className={styles.normalDistance}>
        <Badge
          badgeContent=""
           classes={{badge: user?.status==='online'?styles.online:styles.offline}}
        
          variant="dot"
        />
      </Box>
      <Box>
        <Typography variant="caption" gutterBottom>
          {user?.status}
        </Typography>
      </Box>
      <Box style={{ flexGrow: "1", paddingRight: "15px" }}>
        <Typography variant="h6" gutterBottom className={styles.textRight}>
          ...
        </Typography>
      </Box>
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
