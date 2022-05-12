import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import React, { Component } from 'react'
import Select from 'react-select'



function Landing() {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const [filterGenre, setFilterGenre] = useState([])

    


    
    // const filterArray = () => {
        
    //     console.log(filterRef.current)
    //     const filteredListings = listings.filter(listing => listing.data.genreStyle.value == filterGenre)
        
        
        
        
        
    // }
    
    
    // if (filterGenre.value) {
        
    //     filterArray()
        
    // }





    const genreOptions = [
        { value: 'Reggae', label: 'Reggae' },
        { value: 'Disco Edits', label: 'Disco Edits' },
        { value: 'Disco', label: 'Disco' },
        { value: 'Electronic', label: 'Electronic' },
        { value: 'House', label: 'House' },
        { value: 'Techno', label: 'Techno' }
    ]



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
                console.log(querySnapshot)
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

            <Select
                options={genreOptions}
                id='filter'
                value={filterGenre}
                onChange={setFilterGenre}
            />

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
    )
}

export default Landing
