import { useState,useEffect } from "react";
import{
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Autocomplete,
    TextField,
} from "@mui/material"

import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch,useSelector } from "react-redux";
import {setMode,setLogout} from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import axios from 'axios'
const Navbar=()=>{
    const [isMobileMenuToggled,setIsMobileMenuToggled]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const token = useSelector((state) => state.token); // Adjust according to your state structure

    const user = useSelector((state)=>state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const theme=useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark=theme.palette.neutral.dark;
    const background=theme.palette.background.default;
    const primaryLight=theme.palette.primary.light;
    const alt=theme.palette.background.alt;

    const fullName=`${user.firstName} ${user.lastName}`;
    useEffect(() => {
      if (searchQuery.length >= 5) {
        setIsLoading(true);
  
        axios.get('http://localhost:3001/users/', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((response) => {
            setSearchResults(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching users:', error);
            setIsLoading(false);
          });
      } else {
        setSearchResults([]);
      }
    }, [searchQuery, token]);
  
    const handleUserSelect = (event, value) => {
      if (value) {
        navigate(`/profile/${value._id}`);
      }
    };
    return <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
            <Typography 
            fontWeight="bold"
            fontSize="clamp(1rem,2rem,2.25rem)"
            color="primary"
            onClick={()=>navigate("/home")}
            sx={{
                "&:hover":{
                    color:primaryLight,
                    cursor:"pointer",
                },
            }}
            >
            VJTI SOCIALS
            </Typography>
            
            <Box display="flex" alignItems="center" bgcolor="neutral.light" borderRadius="9px" padding="0.1rem 1.5rem" gap="1rem">
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          onChange={handleUserSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <IconButton onClick={() => handleUserSelect(null, searchResults[0])}>
          <Search />
        </IconButton>
      </Box>
        </FlexBetween>
        {/* DESKTOP NAV  */}
        {isNonMobileScreens ? (
            <FlexBetween gap="2rem">
            <IconButton onClick={()=>dispatch(setMode())}>
                {theme.palette.mode==="dark" ? (
                    <DarkMode sx={{fontSize:"25px"}}/>
                ):(
                    <LightMode SX={{color:dark,fontSize:"25px"}} />
                )}
            </IconButton>
            <IconButton onClick={() => navigate(`${user._id}/chat`)}>
               <Message sx={{ fontsize: "25px" }} />
             </IconButton>
            <Notifications sx={{fontSize:"25px"}}/>
            <Help sx={{fontSize:"25px"}}/>
            <FormControl variant="standard" value={fullName}>
              <Select
              value={fullName}
              sx={{
                  backgroundColor:neutralLight,
                  width:"150px",
                  borderRadius:"0.25rem",
                  p:"0.25rem 1rem",
                  "&.MuiSvgIcon-root": {
                   pr:"0.25rem",
                   width:"3rem"
                  },
                  "&.MuiSelect-select:focus":{
                      backgroundColor:neutralLight
                  }
              
              }}
              input={<InputBase/>} 
              >
               <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
               </MenuItem> 
               <MenuItem onClick={()=>dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
        </FlexBetween>
        ):(
            <IconButton
            onClick={()=>setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
                <Menu/>
            </IconButton>
        )}
        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled &&(
            <Box 
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
            >
            {/* CLOSE ICON  */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
                <IconButton
                onClick={()=>setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Close/>
                </IconButton>
            </Box>
            {/* MENU ITEMS  */}
            <FlexBetween display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="2rem">
            <IconButton onClick={()=>dispatch(setMode())}>
                {theme.palette.mode==="dark" ? (
                    <DarkMode sx={{fontSize:"25px"}}/>
                ):(
                    <LightMode SX={{color:dark,fontSize:"25px"}} />
                )}
            </IconButton>
            <IconButton onClick={() => navigate(`${user._id}/chat`)}>
               <Message sx={{ fontsize: "25px" }} />
             </IconButton>
            <Notifications sx={{fontSize:"25px"}}/>
            <Help sx={{fontSize:"25px"}}/>
            <FormControl variant="standard" value={fullName}>
              <Select
              value={fullName}
              sx={{
                  backgroundColor:neutralLight,
                  width:"150px",
                  borderRadius:"0.25rem",
                  p:"0.25rem 1rem",
                  "&.MuiSvgIcon-root": {
                   pr:"0.25rem",
                   width:"3rem"
                  },
                  "&.MuiSelect-select:focus":{
                      backgroundColor:neutralLight
                  }
              
              }}
              input={<InputBase/>} 
              >
               <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
               </MenuItem> 
               <MenuItem onClick={()=>dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
        </FlexBetween>
            </Box>
        )}     
    </FlexBetween>
};
    
export default Navbar;