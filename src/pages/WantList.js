import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, query, limit, getDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import ListingItem from '../components/ListingItem'
import {toast} from 'react-toastify'



function WantList() {
    const [wantItems, setWantItems] = useState([])
    const [uid, setUid] = useState(null)
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(true)

    const wantRef = useRef(null)
    wantRef.current = wantItems

    const auth = getAuth()

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
    
                    const uid = user.uid;
                    setUid(uid)
                } else {
                    // User is signed out
                    // ...
                }
            });
        }

        return ()=> {
            isMounted.current= false
        }
        
    }, [isMounted])
    
    useEffect(() => {
        

        const fetchWantList = async (uid) => {
           
            try {
                // get a ref to the collection 
                const listingsRef = collection(db, `users/${uid}/wantlist`)

                //create a query 
                const q = query(listingsRef)
                
                //exicute query
                setLoading(true)
                const querySnapshot = await getDocs(q)

                const items = []

                querySnapshot.forEach((item) => {
                    return items.push({
                        id: item.id,
                        item: item.data()
                    })
                })

                console.log('after q snapshot', items)
              
                const itemData = []

                items.forEach((item) => {

                    //save this in a variable and use that 
                    console.log('extract the id', item.item.item)

                    const getItemData = async () => {
                        const docRef = doc(db, "listings", `${item.item.item}`);
                        const docSnap = await getDoc(docRef);


                        if (docSnap.exists()) {
                          
                            setWantItems((prevState) => [
                                ...prevState,
                                {
                                    id: item.id, 
                                    data: docSnap.data()
                                }
                            ]
                            )
                           
                        } else {
                            
                            console.log("No such document!");
                        }

                    }
                    
                    getItemData()
                    
                     
                    
                    
                })
                console.log('item data outside:', itemData)


                console.log('the end',wantItems)
               
                setLoading(false)
                
                
            } catch (error) {
                console.log(error)
            }
        }
        if (uid) {

            fetchWantList(uid)
        }
        
        
    }, [uid]) 
    
    
    const onDelete = async (itemId) => {
        if (window.confirm ('Are you sure you want to delete this from your want list?')) {
            await deleteDoc(doc(db, `users/${auth.currentUser.uid}/wantlist`, itemId))
            const updatedWantlist = wantItems.filter((item) => item.id !== itemId)
            setWantItems(updatedWantlist)
            toast.success("Want list item deleted")
        }
    }







    if ( loading === true ){
        return <h1>Loading...</h1>
    }
   
 

    return (
        <div>
            
             {console.log( 'wantItems from render',wantItems)}
             {console.log( 'wantRef from render',wantRef.current)}
            
            
            {/* <h1>{ wantItems.length && JSON.stringify(wantItems)}</h1> */}

            <ul>
                {wantItems && wantItems.map((item) => (
                    <ListingItem
                        item={item.data}
                        id={item.id}
                        key={item.id}
                        onDelete={() => onDelete(item.id) }
                    />
                ))}
            </ul>  

            {/* <h1>{ wantItems.length && JSON.stringify(wantItems)}</h1> */}

          
            
                


           
        </div>
    )
}

export default WantList
