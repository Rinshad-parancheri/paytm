import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Dashboard } from "./pages/Dashboard"
import { SendMoney } from './pages/SendMoney'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup></Signup>} />
        <Route path="/signin" element={<Signin></Signin>} />
        <Route path="/dashboard" element={<Dashboard></Dashboard>} />
        <Route path='/sendmoney' element={<SendMoney></SendMoney>} />
      </Routes>
    </BrowserRouter>

  )
}


export default App
