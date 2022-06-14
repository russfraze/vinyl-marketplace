import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getDoc, setDoc, addDoc, getDocs, doc, arrayUnion, collection, query } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'


function Listing() {

    const auth = getAuth()

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    // const [itemData, setItemData] = useState(null)
    const [userData, setUserData] = useState({
        name: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
    })

    const [wantlist, setWantlist] = useState({
        item: ''
    })

    // const [cart, setCart] = useState({
    //     item: ''
    // })

    const { name, userId } = userData

    const navigate = useNavigate()
    const params = useParams()


    const addWant = async () => {
        const itemId = params.itemId

        // setWantlist((prevState) => ({
        //     ...prevState,
        //     item: itemId
        // }))

        await addDoc(collection(db, `users/${userId}/wantlist`), {
            item: itemId,
        });

        console.log(wantlist)

    }

    const addCart = async () => {
        const itemId = params.itemId

        // setCart((prevState) => ({
        //     ...prevState,
        //     item: itemId
        // }))

        await addDoc(collection(db, `users/${userId}/cart`), {
            item: itemId,
        });



        // console.log('log cart inside function:',cart)


    }

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.itemId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log(docSnap.data())
                // console.log(listing.artistTitle)
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
            {/* {console.log( 'cart from render',cart)} */}
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