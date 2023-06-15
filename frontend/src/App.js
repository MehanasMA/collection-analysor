
import { colorModeContext,useMode } from "./theme";
import { CssBaseline,ThemeProvider } from "@mui/material";
import {Route,Routes} from "react-router-dom";


import TopBar from "./scence/global/TopBar";
import SidBar from "./scence/global/SidBar";



import AddUser from "./scence/AddUser";
import CollectionReport from "./scence/CollectionReport";
import CollectedReport from "./scence/CollectedReport";
import PendingReport from "./scence/PendingReport";
import Dashboard from "./scence/Dashboard";
import AllUsers from "./scence/AllUser";
import Account from "./scence/Account";



function App() {
  const[theme,colorMode]= useMode()
  return (
    <colorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      
    <div className="app">
      <SidBar></SidBar>
      <main className="content">
      <TopBar></TopBar>


      <Routes>
        <Route path="/" element={<Dashboard></Dashboard>}/>
         <Route path="/adduser" element={<AddUser></AddUser>}/>
        <Route path="/collectionReport" element={<CollectionReport></CollectionReport>}/>
        <Route path="/collectedReport" element={<CollectedReport></CollectedReport>}/>
        <Route path="/pendingReport" element={<PendingReport></PendingReport>}/>
        <Route path="/allUsers" element={<AllUsers></AllUsers>}/>
        <Route path="/account" element={<Account></Account>}/>
        {/* <Route path="/addStaff" element={<AddStaff></AddStaff>}/> */}
        {/* <Route path="/form" element={<Form/>}/> */}
        </Routes>
      </main>

    </div>

    </ThemeProvider>

</colorModeContext.Provider>
  );
}

export default App;
