import { useNavigate, useLocation, Navigate,Link } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const auth = getAuth()


    return (
        <footer className='navbar'>
            <nav className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className='navbarListItem' onClick={() => navigate('/')}>
                        <p>Home</p>
                    </li>
                    <li className='navbarListItem'>
                        <p>Something</p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/profile')}>
                        <p>Profile</p>
                    </li>

                    {!auth.currentUser && <li><Link className="navbarLink" to='/sign-in'>Sign In</Link></li>}                 
                </ul>

            </nav>

        </footer>
    )
}

export default Navbar
