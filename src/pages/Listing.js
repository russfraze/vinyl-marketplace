import {Link, useNavigate, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {getDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'


function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.itemId)
            const docSnap = await getDoc(docRef)

            if( docSnap.exists()) {
                // console.log(docSnap.data())
                console.log(listing.artistTitle)
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()
    },[navigate, params.itemId])

    if (loading) {
        <h1>Loading ...</h1>
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
        </main>
    )
}

export default Listing
