import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'



function Landing() {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //get a ref to the collection 
                const listingsRef = collection(db, 'listings')

                //create a query
                const q = query(listingsRef,
                    orderBy('timestamp', 'desc'), limit(10)
                )

                //Exicute query
                const querySnapshot = await getDocs(q)
                //create an empty array
                const listings = []

                querySnapshot.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                console.log(listings)


            } catch (error) {
                toast.error('can not show listings')
            }
        }
        fetchListings()
    }, [])

    return (
        <div>
            <h1>Landing</h1>
            <Link to='/sign-in'>
                Sign In
            </Link>

            <ul>
                {listings && listings.map((item) => (
                    <ListingItem
                        item={item.data}
                        id={item.id}
                        key={item.id}
                    />
                ))}
            </ul>  
        </div>
    )
}

export default Landing
