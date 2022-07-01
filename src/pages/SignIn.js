import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import outlineEyeOpen from '../assets/outline-eye-open.svg'

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })
    // destructure these variables from the userData so they can be used
    //as values in the forms 
    const { email, password } = userData

    const navigate = useNavigate()

    const onChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            ///here is the tricky part with two ids
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {

            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            //check to see if the user is valid and redirect 
            if (userCredential.user) {
                navigate('/')
            }

        } catch (error) {
            console.log(error)
        }

    }


    return (
        <>
            <div>
                <form onSubmit={onSubmit}>
                    <input
                        type='email'
                        placeholder='Email'
                        id='email'
                        value={email}
                        onChange={onChange}
                    />
                    <div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            id='password'
                            value={password}
                            onChange={onChange}
                        />

                        <img src={outlineEyeOpen}
                            onClick={() => setShowPassword((prevState) => !prevState)}
                        />
                    </div>
                    <br></br>
                    <button type="submit">
                        Submit
                    </button>
                    <br></br>
                    <br></br>
                    {/* google OAuth */}

                    <Link to='/forgot-password'>Forgot password</Link>
                    <br></br>
                    <br></br>
                    <Link to='/sign-up'>Sign up</Link>
                </form>

            </div>
        </>
    )
}

export default SignIn
