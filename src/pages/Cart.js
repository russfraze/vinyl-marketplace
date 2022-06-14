import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, query, addDoc, getDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, useParams } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import {toast} from 'react-toastify'



function Cart() {
    const [cartItems, setCartItems] = useState([])
    const [uid, setUid] = useState(null)
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(true)

    const wantRef = useRef(null)
    // is this used in my code? if not take out of wantlist page too 
    useRef.current = cartItems

    const auth = getAuth()
    const navigate = useNavigate()
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
        

        const fetchCart = async (uid) => {
           
            try {
                // get a ref to the collection 
                const listingsRef = collection(db, `users/${uid}/cart`)

                //create a query 
                const q = query(listingsRef)
                console.log( 'new log',listingsRef)
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
                          
                            setCartItems((prevState) => [
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


                console.log('the end',cartItems)
               
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



    console.log( ' just gimme',cartItems.length)
    console.log( ' stringify',  JSON.stringify(cartItems))

    let sum = 0
    
    for (let i = 0; i < cartItems.length; i++) {
        sum += parseInt(cartItems[i].data.price)
    }

    console.log(sum)





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
                        id={item.id}
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
