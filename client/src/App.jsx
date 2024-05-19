import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Homepage from './pages/Hompage';
import ChooseUser from './pages/ChooseUser';
export default function App() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      {/* header */}
      <Header className='fixed z-50' />
      
      <Routes>
      {!currentUser?<Route path='/' element={<Homepage />} />
        : <Route path='/' element={<Home />} />}
        <Route path='/Home' element={<Home />}/>
        <Route path='/About' element={<About />}/>
        <Route path='/choose' element={<ChooseUser />} />
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