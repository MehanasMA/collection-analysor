import { useState } from 'react'
import Topbar from './scene/global/topBar'
import Sidebar from './scene/global/sideBar'
import { Route, Routes } from 'react-router-dom'
import { colorModeContext,useMode } from "./theme";
import { CssBaseline,ThemeProvider } from "@mui/material";
import AddUser from './scene/AddUser'
import CollectionReport from "./scene/CollectionReport";
import CollectedReport from "./scene/CollectedReport";
import PendingReport from "./scene/PendingReport";
import AllUsers from "./scene/AllUsers";
import AddStaff from "./scene/AddStaffs";
import  Form  from './scene/form';

function App() {
  
  const[theme,colorMode]= useMode()
  return (
    <colorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <div className="app">
        <Sidebar />
           <main className="content">
        <Topbar />
        <Routes>
        {/* <Route path="/" element={<Dashboard></Dashboard>}/>  */}
        <Route path="/adduser" element={<AddUser></AddUser>}/>
        <Route path="/collectionReport" element={<CollectionReport></CollectionReport>}/>
        <Route path="/collectedReport" element={<CollectedReport></CollectedReport>}/>
        <Route path="/pendingReport" element={<PendingReport></PendingReport>}/>
        <Route path="/allUsers" element={<AllUsers></AllUsers>}/>
        <Route path="/addStaff" element={<AddStaff></AddStaff>}/>
        <Route path="/form" element={<Form/>}/>

        {/* <Route path="/transactoins" element={<Transactions></Transactions>}/> */} 
      </Routes>
      </main>
    </div> 
    </ThemeProvider>

   </colorModeContext.Provider>

  )
}

export default App
