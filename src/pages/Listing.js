import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getDoc, addDoc, doc, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'


function Listing() {

    const auth = getAuth()

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState({
        name: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
    })

    const { name, userId } = userData

    const params = useParams()

    //add this item to users wantlist 
    const addWant = async () => {
        const itemId = params.itemId

        await addDoc(collection(db, `users/${userId}/wantlist`), {
            item: itemId,
        });

        toast.success('Item added to wantlist.')

    }

    //add this item to users cart
    const addCart = async () => {
        const itemId = params.itemId

        await addDoc(collection(db, `users/${userId}/cart`), {
            item: itemId,
        });

        toast.success('Item added to cart.')

    }

    //get this listing from the listings collection
    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.itemId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()
    }, [params.itemId])

    if (loading) {
        return <h1>Loading ...</h1>
    }

    return (
        <main>
            <div className="singleListing">
                    <img className='singleListingImg' src={listing.imgUrls[0]}></img>
                <div className="singleListingItems">
                    <h1>{listing.artistTitle}</h1>
                    <p>Label:  {listing.label}</p>
                    <p>Condition:  {listing.condition.value}</p>
                    <p>Genre / Style: {listing.genreStyle.value}</p>
                    <p>Description: {listing.description}</p>
                    <h3>$ {listing.price}</h3>
                    <button className="primaryButton" type='button' onClick={addCart}>Add to cart</button>
                    <button className="primaryButton" type='button' onClick={addWant}>Add to wantlist</button>
                </div>
            </div>
        </main>
    )
}

export default Listing