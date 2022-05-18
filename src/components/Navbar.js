import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const auth = getAuth()

    //check to see if the location matches 
    const pathMatchRoute = (route) => {
        if(route === location.pathname) {
            return true
        }

    }


    return (
        <footer className='navbar'>
            <nav className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className='navbarListItem' onClick={() => navigate('/')}>
                        <p className={pathMatchRoute('/') ? 'navbarActive' : ''}>Home</p>
                    </li>
                    <li className='navbarListItem'>
                        <p >Something</p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/profile')}>
                        <p className={pathMatchRoute('/profile') ? 'navbarActive' : ''}>Profile</p>
                    </li>

                    {!auth.currentUser && <li className='navbarListItem' onClick={() => navigate('/sign-in')}>
                        <p>Sign In</p>
                    </li>}
                </ul>

            </nav>

        </footer>
    )
}

export default Navbar
