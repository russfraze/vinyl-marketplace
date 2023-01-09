import { useEffect, useState } from 'react'
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import Select from 'react-select'



function Landing() {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const [filterGenre, setFilterGenre] = useState([])

    //search bar options 
    const genreOptions = [
        { value: 'Reggae', label: 'Reggae' },
        { value: 'Disco Edits', label: 'Disco Edits' },
        { value: 'Disco', label: 'Disco' },
        { value: 'Electronic', label: 'Electronic' },
        { value: 'House', label: 'House' },
        { value: 'Techno', label: 'Techno' },
        { value: null, label: 'all' }
    ]


    //get the listings from the database
    useEffect(() => {
        const fetchListings = async () => {

            if (filterGenre.value ) {
                //get the filtered results
                try {
                    //get a ref to the collection 
                    const listingsRef = collection(db, 'listings')
                   
                    //create a query
                    const q = query(listingsRef, where( 'genreStyle.value', '==', filterGenre.value)
                        // orderBy('timestamp', 'desc'), limit(10)
                    )
                    //Exicute query
                    const querySnapshot = await getDocs(q)
                    
                    const listings = []

                    //loop over the items and store them in state
                    querySnapshot.forEach((doc) => {
                        return listings.push({
                            id: doc.id,
                            data: doc.data()
                        })
                    })
    
                    setListings(listings)
    
                } catch (error) {
                    toast.error('can not show listings')
                }
                
            } else {
                //get the unfiltered list from database
                try {
                    //get a ref to the collection 
                    const listingsRef = collection(db, 'listings')
                   
                    //create a query
                    const q = query(listingsRef,
                        orderBy('timestamp', 'desc'), limit(12)
                    )
                    //Exicute query
                    const querySnapshot = await getDocs(q)
                    
                    const listings = []
                    
                    //loop over the items and store them in state
                    querySnapshot.forEach((doc) => {
                        return listings.push({
                            id: doc.id,
                            data: doc.data()
                        })
                    })
    
                    setListings(listings)
    
                } catch (error) {
                    toast.error('can not show listings')
                }

                
            }


        }
        fetchListings()
    }, [filterGenre])



    return (
        <div>
            
            <Select
                options={genreOptions}
                id='filter'
                value={filterGenre}
                onChange={setFilterGenre}
            />

            <div className='createDiv'>
            <ul className='landingUl'>
                {listings && listings.map((item) => (
                    <ListingItem
                        item={item.data}
                        id={item.id}
                        key={item.id}
                    />
                ))}
            </ul>
            </div>
        </div>
    )
}

export default Landing
