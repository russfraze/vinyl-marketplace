import { getAuth } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    const [userData, setUserData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const {name, email} = userData

    

    const navigate = useNavigate()

    const logOut = () => {
        console.log('err')
        auth.signOut()
        navigate('/')
    }

    const onSubmit = () => {
        console.log(userData)
    }

    const onChange = (e) => {
       setUserData((prevState) => ({
           ...prevState,
           [e.target.id]: e.target.value
       }))   
    }

    return (
        <>
            {/* {user ? <h1>{user.displayName}</h1> : 'Not logged in'} */}
            <h3>Personal Details</h3>
            <p onClick={()=> {
                changeDetails && onSubmit()
                setChangeDetails((prevState) => !prevState)
            }}>{ changeDetails ? 'done' : 'change'}</p>
            <h3>{name}</h3>

            <form>
                <input 
                className={!changeDetails ? 'inputActive' : 'inputDisabled'}
                type="text"
                value={name}
                id="name"
                disabled={!changeDetails}
                onChange={onChange}
                /> 
                <input 
                className={!changeDetails ? 'inputActive' : 'inputDisabled'}
                type="text"
                value={email}
                id="email"
                disabled={!changeDetails}
                onChange={onChange}
                /> 
            </form>

            <button type="button" onClick={logOut}>Logout</button>
        </>
    )
}

export default Profile
