import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, query, addDoc, getDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import ListingItem from '../components/ListingItem'
import {toast} from 'react-toastify'
import { useParams } from 'react-router-dom'



function WantList() {
    const [wantItems, setWantItems] = useState([])

    //im not saving it in state here 
    const [cart, setCart] = useState({
        item: ''
    })
    const [uid, setUid] = useState(null)
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(true)

    const wantRef = useRef(null)
    wantRef.current = wantItems

    const auth = getAuth()
    const params = useParams()

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
                console.log(querySnapshot)
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
                                    listingId: item.item.item, 
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



    const addCart = async (itemId) => {
        
        // console.log('want of 0:',wantItems[i].listingId)
        console.log('duuuuuuhhhhhhrrerrrr')
        console.log(itemId)
        
        // setCart((prevState) => ({
        //     ...prevState,
        //     item: itemId
        // }))

        await addDoc(collection(db, `users/${auth.currentUser.uid}/cart`), {
            item: itemId,
        });

    }



    if ( loading === true ){
        return <h1>Loading...</h1>
    }
   
 

    return (
        <div>
            
             {console.log( 'wantItems from render',wantItems)}
             {/* {console.log( 'wantRef from render',wantRef.current)} */}
            
            
            {/* <h1>{ wantItems.length && JSON.stringify(wantItems)}</h1> */}

            <ul>
                {wantItems && wantItems.map((item) => (
                    <ListingItem
                        item={item.data}
                        id={item.listingId}
                        key={item.id}
                        listingId={item.listingId}
                        onDelete={() => onDelete(item.id) }
                        addCart={() => addCart(item.listingId)}
                    />
                ))}
            </ul>  

            {/* <h1>{ wantItems.length && JSON.stringify(wantItems)}</h1> */}

          
            
                


           
        </div>
    )
}

export default WantList
