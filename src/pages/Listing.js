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

    const { name, userId } = userData

    const navigate = useNavigate()
    const params = useParams()


    const addWant = async () => {
        const itemId = params.itemId

        setWantlist((prevState) => ({
            ...prevState,
            item: itemId
        }))

        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const queryData = querySnapshot.docs.map((item) => ({
            ...item.data(),
            id: item.id,
        }));
        console.log(queryData);

   

        await addDoc(collection(db, `users/${userId}/wantlist`), {
            item: itemId,
        });



        console.log(wantlist)

        // const docRef = doc(db, "users", `${userId}`)
        // const docSnap = await getDoc(docRef)

        // if (docSnap.exists()) {
        //     console.log("Document data:", docSnap.data());
        // } else {

        //     console.log("No such document!");
        // }

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
            Listing single item

            <div>
                <img src={listing.imgUrls[0]}></img>
                <h1>{listing.artistTitle}</h1>
                <p>{listing.label}</p>
                <p>{listing.condition.value}</p>
                <p>{listing.genreStyle.value}</p>
                <p>$ {listing.price}</p>
            </div>
            <button type='button'>Add to cart</button>
            <button type='button' onClick={addWant}>Add to wantlist</button>
        </main>
    )
}

export default Listing