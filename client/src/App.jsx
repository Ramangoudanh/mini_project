import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/Signin';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Complaints from './pages/Complaints';
import MyComplaints from './pages/MyComplaints';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Status from './pages/Status';
import Catgorical from './pages/Catgorical';
export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header className='fixed z-50' />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/status' element={<Status/>} />
        <Route path='/catgorical' element={<Catgorical/>} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
        <Route path='/complaints' element={<Complaints />}/>
        </Route>
        <Route element={<PrivateRoute />}>
         <Route path='/my-complaints' element={<MyComplaints />}/>
         </Route>
        <Route element={<PrivateRoute />}>
         <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}