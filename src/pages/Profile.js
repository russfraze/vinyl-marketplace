import { getAuth, updateProfile } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import {db} from '../firebase.config'
import ListingItem from '../components/ListingItem'
import {toast} from 'react-toastify'

function Profile() {
    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    // const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const [userData, setUserData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const {name, email} = userData

    

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, where( 'userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)

            const listings = []

            querySnap.forEach((item) => {
                return listings.push({
                    id: item.id,
                    data: item.data()
                })
            })

            setListings(listings)

        }

        fetchUserListings()
    },[auth.currentUser.uid])

    const logOut = () => {
        console.log('err')
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if (name !== auth.currentUser.displayName){
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }


        } catch (error) {
            
        }
        console.log(userData)
    }

    const onChange = (e) => {
       setUserData((prevState) => ({
           ...prevState,
           [e.target.id]: e.target.value
       }))   
    }

    const onDelete = async (itemId) => {
        if (window.confirm ('Are you sure you want to delete this listing?')) {
            await deleteDoc(doc(db, 'listings', itemId))
            const updatedListings = listings.filter((item) => item.id !== itemId)
            setListings(updatedListings)
            toast.success("Listing deleted")
        }
    }

    const onEdit = (itemId) => navigate(`/edit-listing/${itemId}`)

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
            <Link to='/create-listing'>Create Listing</Link>

            {listings?.length > 0 && (
                <>
                <p>Your Listings</p>
                <ul>
                    {listings.map((item) => (
                        <ListingItem 
                        key={item.id} 
                        item={item.data} 
                        id={item.id} 
                        onDelete={() => onDelete(item.id) } 
                        onEdit={() => onEdit(item.id)}
                        />
                    ))}
                </ul>
                </>
            )}

        </>
    )
}

export default Profile
