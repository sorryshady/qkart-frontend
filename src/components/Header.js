import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory } from "react-router-dom";
import {Search} from "@mui/icons-material";
import { Avatar,TextField, InputAdornment, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons}) => {
  const username = localStorage.getItem('username');
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('balance');
    localStorage.removeItem('username');
    window.location.reload();
  }
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {hasHiddenAuthButtons ?<Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {history.push("/")}}
        >Back to explore
        </Button> : username ? <div className='username-text'>
            <Stack direction='row' spacing={1}>
              <Avatar className='profile-image' src="avatar.png" alt={username} />
              <div className='username'>{username}</div>
              <Button onClick={logout}>LOGOUT</Button>
            </Stack>
          </div> : <Box>
            <Stack direction='row' spacing={1}>
              <Button onClick={() => {history.push("/login")}}>LOGIN</Button>
              <Button className='button' onClick={() => {history.push("/register")}}>REGISTER</Button>
            </Stack>
          </Box>}
      </Box>
    );
};

export default Header;
