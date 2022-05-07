import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Landing from './pages/Landing'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CreateListing from './pages/CreateListing'
import Listing from './pages/Listing'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import WantList from './pages/WantList'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />}/>
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/landing/:itemId' element={<Listing />} />
          <Route path='/want-list' element={<WantList />} />

        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
