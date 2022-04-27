import {useEffect, useState, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'



function CreateListing() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        artistTitle: '',
        condition: '',
        description: '',
        format: '',
        genreStyle: '',
        images: {},
        label: '',
        price: 0,

    })

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if(isMounted) {
            //onAuthStateChanged an observer for changes to the users sing in state
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid})
                } else {
                    navigate('/sign-in')
                }
            })
        }

        
        return () => {
            isMounted.current =false
        }
    },[isMounted])
    
    console.log(formData)

    if (loading) {
        return <h1>Loading ...</h1>
    }

    return (
        <div>
            Create Listing
        </div>
    )
}

export default CreateListing
