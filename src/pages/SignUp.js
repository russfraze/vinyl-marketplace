import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, setDoc, addDoc, serverTimestamp, collection } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from '../firebase.config'
import outlineEyeOpen from '../assets/outline-eye-open.svg'

function SignUp() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
    })
    // destructure these variables from the userData so they can be used
    const { name, email, password } = userData

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
            const auth = getAuth() //get auth value
            //register user and store in userCredential 
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            // get the user 
            const user = userCredential.user
            //update display name
            updateProfile(auth.currentUser, {
                displayName: name
            })
            //make a copy of the user data and delete the password
            const userDataCopy = { ...userData }
            delete userDataCopy.password
            //add timestanp property and set to timestamp function 
            userDataCopy.timestamp = serverTimestamp()
            // update the database, adding user to the users collection 
            await setDoc(doc(db, 'users', user.uid), userDataCopy)

            

            //redirect
            navigate('/')

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            <div>
                <form onSubmit={onSubmit}>

                    <input
                        type='name'
                        placeholder='Name'
                        id='name'
                        value={name}
                        onChange={onChange}
                    />
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

                        <img src={outlineEyeOpen} />
                    </div>

                    <button type="submit">
                        Submit
                    </button>

                    {/* google OAuth */}

                    <Link to='/forgot-password'>Forgot password</Link>
                    <Link to='/sign-in'>Sign in</Link>
                </form>
            </div>
        </>
    )
}

export default SignUp
