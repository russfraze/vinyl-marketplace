import {useNavigate, useLocation, Navigate} from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation() 


    return (
        <footer className='navbar'>
            <nav className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className='navbarListItem' onClick={() => navigate('/')}>
                        <h1>Home</h1>
                    </li>
                    <li className='navbarListItem'>
                        <h1>Something</h1>
                    </li>
                    <li className='navbarListItem'onClick={() => navigate('/profile')}>
                        <h1>Profile</h1>
                    </li>
                </ul>

            </nav>
            
        </footer>
    )
}

export default Navbar
