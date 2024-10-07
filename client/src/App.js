import { BrowserRouter,Navigate,Routes,Route } from "react-router-dom";
import Homepage from "scenes/homePage";
import Loginpage from "scenes/loginPage";
import Profilepage
 from "scenes/profilePage";
 import Chat from "components/chat";
import { useMemo} from "react";
import {  useSelector } from "react-redux/es/hooks/useSelector";
import { CssBaseline,ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { themeSettings } from "theme";
function App() {
  const mode =useSelector((state)=>state.mode);
  const theme=useMemo(()=> createTheme(themeSettings(mode)),[mode]);
  const isAuth = Boolean(useSelector((state)=>state.token));
  return (
    <div className="App">
     <BrowserRouter>
     <ThemeProvider theme={theme}>
       <CssBaseline/>
       <Routes>
        <Route path="/" element={<Loginpage/>}/>
        <Route path="/home" element={isAuth ? <Homepage/>:<Navigate to="/"/>}/>
        <Route path="/profile/:userId" element={isAuth ?<Profilepage/> :<Navigate to="/"/>}/>
        <Route path="/home/:userId/chat" element={isAuth ?<Chat/> :<Navigate to="/"/>}/>
       </Routes>
      </ThemeProvider>
     </BrowserRouter>
    </div>
  );
}

export default App;
