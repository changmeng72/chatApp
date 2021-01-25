import { Menu,MenuItem, Box,  Typography } from "@material-ui/core";
import UserCard from "./UserCard";
import { makeStyles } from "@material-ui/core/styles";
import SearchBar from "material-ui-search-bar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import postData from '../utils/postData';
import IconButton from '@material-ui/core/IconButton';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 400,
    paddingLeft:"10px"
  },
  userlistbox: {
    width: "100%",
    backgroundColor: 'hsl(210, 50%, 99%)',
    overflow: "auto",
    scrollbarWidth: "none",
    marginTop: "5px",
    flexGrow:1
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
      backgroudColor: "white",
    },
    backgroudColor: "red",
  },
  chats: {
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 600,
    fontSize: "17px",
    marginTop: "12px",
    marginBottom: "12px",
  },
  growright: {
    flexGrow: "1",
    paddingRight: "15px",
  },
  btnRight: {
    clear: "both",
    float: "right",
    clear: "both",
    color: 'rgb(208, 218, 233)', 
    
  },
  searchCaption:{
    fontSize: '10px',
    color: 'rgb(178, 181, 200)'

  },
  showWhenSmall: {
        display:'none',
        [theme.breakpoints.down('xs')]: {
            display:'inline'
        }
    }

}));

export default function UserList({ user, users, selectUser,searchUser,logout,searchedUsers,hideUserList}) {
  const styles = useStyles();
  const [searchText, setSearchText] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
  console.log("searchedUsers", searchedUsers);
  


  useEffect(() => {
    if (searchText !== '') {
       searchUser(searchText);
    }
    
  },[searchText]); 

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
          <UserCard user={user} inList={false} />

          <Box className={styles.growright}>
             <Box className={styles.btnRight}>
              <IconButton 
                size={'small'}
              onClick={(event) => setAnchorEl(event.currentTarget)}>
              <MoreHoriz />
            </IconButton>
             
              <IconButton 
                size={'small'}
                onClick={() => hideUserList(true)}
              className={styles.showWhenSmall}>
              < MenuRoundedIcon />
              </IconButton>
            </Box>
           </Box>
        </Box>
        <Box className={styles.chats}>Chats</Box>
        <Box>
          <SearchBar
            value={searchText}
            className={styles.searchBar}
            onChange={(newValue) => setSearchText(newValue)}
            onCancelSearch={()=>setSearchText('')}
            onRequestSearch={() => {
              
              let find = 0;
              for (let u of users) {
                if (u.username == searchText) {
                  find = 1;
                  selectUser(u);
                }
              }
              if (find == 0) {
                console.log("St:",searchText);
                searchUser(searchText);
              }
               
               
            }}
          />
        </Box>
        {searchText === ''?
         
          <Box className={styles.userlistbox}>
          
            {users.map((u) => {
              
              return (
                <UserCard key={u._id} user={u} selectUser={selectUser} inList={true} hideUserList={hideUserList}/>
              );
            })}
          </Box>
          :
          <Box className={styles.userlistbox}>
               
            {searchedUsers?.length === 0 ? <p className={styles.searchCaption}>No users are found!</p>:''}
            
            
            {
              searchedUsers?.map((u) => {
                return (
                  user._id !== u._id ? <UserCard key={u._id} user={u} selectUser={selectUser} inList={true} hideUserList={hideUserList}/> : ''
              );
            })}
          </Box>}
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
