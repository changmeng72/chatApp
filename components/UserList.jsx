import { Menu,MenuItem, Box,  Typography } from "@material-ui/core";
import UserCard from "./UserCard";
import { makeStyles } from "@material-ui/core/styles";
import SearchBar from "material-ui-search-bar";
import { useState } from "react";
import { useRouter } from "next/router";
import postData from '../utils/postData';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 600,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 400,
  },
  userlistbox: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    scrollbarWidth: "none",
    marginTop: "5px",
  },
  "userlistbox ::-webkit-scrollbar-track": {
    width: 0,
  },

  searchBar: {
    backgroundColor: "rgba(225,225,225,0.2)",
    border: "0px solid black",
    outline: "none",
    boxShadow: "none",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 400,
    fontSize: "9px",
  },
  userBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",

    marginBottom: "10px",
    alignItems: "center",
  },
  user: {
    "&:hover": {
      backgroudColor: "red",
    },
    backgroudColor: "red",
  },
  chats: {
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 600,
    fontSize: "16px",
    marginTop: "12px",
    marginBottom: "12px",
  },
  growright: {
    flexGrow: "1",
    paddingRight: "15px",
  },
  textRight: {
    clear: "both",
    float: "right",
    clear: "both",
    color: "gray",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function UserList({ user, users, selectUser,searchUser,logout }) {
  const styles = useStyles();
  const [searchText, setSearchText] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();


    const handleClose = () => {
    setAnchorEl(null);
    };
    
    const handleLogout = async () => {
        const url = "/api/logout";
        const json = await postData(url, {});
        logout();
    }


  return (
    <>
      <Box className={styles.root}>
        <Box className={styles.userBox}>
          <UserCard user={user} />
          <Box className={styles.growright}>
            <Typography
              variant="h6"
              gutterBottom
              className={styles.textRight}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              ...
            </Typography>
          </Box>
        </Box>
        <Box className={styles.chats}>Chats</Box>
        <Box>
          <SearchBar
            value={searchText}
            className={styles.searchBar}
            onChange={(newValue) => setSearchText(newValue)}
            onRequestSearch={() => {
              
              let find = 0;
              for (let u of users) {
                if (u.username == searchText) {
                  find = 1;
                  selectUser(u);
                }
              }
              if (find == 0) {
                
                searchUser(searchText);
              }
               
               
            }}
          />
        </Box>
        <Box className={styles.userlistbox}>
         

          {users.map((user) => {
            return (
              <UserCard key={user._id} user={user} selectUser={selectUser} />
            );
          })}
        </Box>
      </Box>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
