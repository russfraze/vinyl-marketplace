import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, query, getDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate} from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import {toast} from 'react-toastify'



function Cart() {
    const [cartItems, setCartItems] = useState([])
    const [uid, setUid] = useState(null)
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(true)

    const auth = getAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
    
                    const uid = user.uid;
                    setUid(uid)
                } else {
                    // User is signed out
                }
            });
        }

        return ()=> {
            isMounted.current= false
        }
        
    }, [isMounted])
    
    useEffect(() => {
        
        //get record's listing id from users want list
        const fetchCart = async (uid) => {
           
            try {
                // get a ref to the collection 
                const listingsRef = collection(db, `users/${uid}/cart`)

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
              
                //loop through array and get the record's data from listing collection 
                items.forEach((item) => {

                    const recordListId = item.item.item

                    const getItemData = async () => {
                        const docRef = doc(db, "listings", `${recordListId}`);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                          
                            setCartItems((prevState) => [
                                ...prevState,
                                {
                                    id: item.id,
                                    listingId: recordListId, 
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
               
                setLoading(false)
                
                
            } catch (error) {
                console.log(error)
            }
        }

        if (uid) {

            fetchCart(uid)
        }
        
        
    }, [uid]) 
    
    
    const onDelete = async (itemId) => {
        if (window.confirm ('Are you sure you want to delete this from your cart?')) {
            await deleteDoc(doc(db, `users/${auth.currentUser.uid}/cart`, itemId))
            const updatedWantlist = cartItems.filter((item) => item.id !== itemId)
            setCartItems(updatedWantlist)
            toast.success("Item deleted from cart")
        }
    }

    let sum = 0
    
    for (let i = 0; i < cartItems.length; i++) {
        sum += parseInt(cartItems[i].data.price)
    }

    if ( loading === true ){
        return <h1>Loading...</h1>
    }
   


    return (
        <div className='cart'>
            <button className='specialButton' onClick={ () => navigate('/want-list')}>Wantlist</button>
            <ul>
                {cartItems && cartItems.map((item) => (
                    <ListingItem
                        item={item.data}
                        id={item.listingId}
                        key={item.id}
                        onDelete={() => onDelete(item.id) }
                    />
                ))}
            </ul> 
            <h1>Total: ${sum}.00</h1> 
        </div>
    )
}

export default Cart
