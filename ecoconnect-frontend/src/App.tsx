import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Signin from './pages/Sign-in'
import { useState } from 'react'
import Profile from './pages/Profile'
import Home from './pages/Home'
import BusinessDetail from './pages/SingleBusiness'

function App() {
const [search, setSearch] = useState<string>("")
  return (
    <>
    <BrowserRouter>
      <Navbar searchTerm={search} onSearchChange={setSearch}/>

<Routes>
  <Route path='/' element={<Home search={search} />} />
  <Route path='/profile' element={<Profile />} />
  <Route path='/business/:id' element={<BusinessDetail />} />
  <Route path='/sign-in' element={<Signin />} />
</Routes>


    </BrowserRouter>
  
    </>
  )
}

export default App
