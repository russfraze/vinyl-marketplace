import { getAuth, updateProfile } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import ListingItem from '../components/ListingItem'
import { toast } from 'react-toastify'

function Profile() {
    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    const [listings, setListings] = useState(null)
    const [userData, setUserData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const { name, email } = userData

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

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
    }, [auth.currentUser.uid])

    const logOut = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if (name !== auth.currentUser.displayName) {
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

    }

    const onChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            await deleteDoc(doc(db, 'listings', itemId))
            const updatedListings = listings.filter((item) => item.id !== itemId)
            setListings(updatedListings)
            toast.success("Listing deleted")
        }
    }

    const onEdit = (itemId) => navigate(`/edit-listing/${itemId}`)

    return (
        <>

            <div className='profileBody'>
            <h3>Personal Details</h3>
                <div className='profileForm'>
                    <h3 className='profileName'>{name}</h3>
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
                    <p className='changeDetailsBtn' onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}>{changeDetails ? 'done' : 'change'}</p>
                    <button className='primaryButton' type="button" onClick={logOut}>Logout</button>
                </div>

                
                <button className='specialButton' onClick={ () => navigate('/create-listing')}>Create Listing</button>
                

                {listings?.length > 0 && (
                    <div>
                        <h3>Your Listings</h3>
                        <ul className='profileUl'>
                            {listings.map((item) => (
                                <ListingItem
                                    key={item.id}
                                    item={item.data}
                                    id={item.id}
                                    onDelete={() => onDelete(item.id)}
                                    onEdit={() => onEdit(item.id)}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}

export default Profile
