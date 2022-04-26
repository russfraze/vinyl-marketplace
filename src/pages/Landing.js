import {Link} from 'react-router-dom'

function Landing() {
    return (
        <div>
            <h1>Landing</h1>
            <Link to='/sign-in'>
                Sign In
            </Link>
        </div>
    )
}

export default Landing
