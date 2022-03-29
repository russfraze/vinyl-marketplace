import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import outlineEyeOpen from '../assets/outline-eye-open.svg'

function SignIn() {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = userData

    const navigate = useNavigate()

    const onChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            ///here is the tricky part with two ids
            [e.target.id]: e.target.value
        }))
    }

    return (
        <>
            <div>
                <form>
                    <input
                        type='email'
                        placeholder='Email'
                        id='email'
                        value={email}
                        onChange={onChange}
                    />
                    <div>
                        <input
                            type='password'
                            placeholder='Password'
                            id='password'
                            value={password}
                            onChange={onChange}
                        />

                        <img src={outlineEyeOpen}/>
                    </div>

                    {/* google OAuth */}

                    <Link to='/forgot-password'>Forgot password</Link>
                    <Link to='/sign-up'>Sign up</Link>
                </form>
            </div>
        </>
    )
}

export default SignIn
