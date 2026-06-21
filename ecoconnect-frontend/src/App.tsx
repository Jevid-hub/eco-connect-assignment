import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Signin from './pages/Sign-in'
import { useState } from 'react'

function App() {
const [search, setSearch] = useState<string>("")
  return (
    <>
    <BrowserRouter>
      <Navbar searchTerm={search} onSearchChange={setSearch}/>

<Routes>
  <Route path='/' element={<>home</>} />
  <Route path='/' element={<>home</>} />
  <Route path='/' element={<>home</>} />
  <Route path='/sign-in' element={<Signin />} />
</Routes>


    </BrowserRouter>
  
    </>
  )
}

export default App
