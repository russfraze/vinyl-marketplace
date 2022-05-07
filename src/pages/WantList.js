import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore'
import { db } from '../firebase.config'



function WantList() {
    const [wantItems, setWantItems] = useState(null)
    const [uid, setUid] = useState(null)

    const auth = getAuth()
   
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                
                const uid = user.uid;
                setUid(uid)
            } else {
                // User is signed out
                // ...
            }
        });
    },[])

    useEffect(() => {
        
        const fetchWantList = async () => {
            try {
                // get a ref to the collection 
                const listingsRef = collection(db, `users/${uid}/wantlist`)

                //create a query 
                const q = query(listingsRef,
                    limit(10)
                )

                //exicute query
                const querySnapshot = await getDocs(q)

                const items = []

                querySnapshot.forEach((item) => {
                    return items.push({
                        id: item.id,
                        data: item.data()
                    })
                })

                setWantItems(items)

            } catch (error) {
                console.log(error)
            }
        }
        fetchWantList()
    }, [uid])

    console.log(wantItems)


    return (
        <div>
            Wantlist
        </div>
    )
}

export default WantList
