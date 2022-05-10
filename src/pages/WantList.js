import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, query, limit, getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import WantItem from '../components/WantItem'



function WantList() {
    const [wantItems, setWantItems] = useState([
        
    ])
    const [uid, setUid] = useState(null)
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(true)

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
                            itemData.push({
                                id: item.id, 
                                data: docSnap.data()
                            });
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }

                    }

                    getItemData()
                    
                    
        
                    
                })
                console.log('item data outside:', itemData)

                //read about stale state!!!
                setWantItems((wantItems) => wantItems.concat(itemData))
            
                setLoading(false)
                
                
            } catch (error) {
                console.log(error)
            }
        }
        if (uid) {

            fetchWantList(uid)
        }
        
        
    }, [uid]) 
    
    
        // console.log('want items in state', wantItems)
        
   
    if ( loading === true ){
        return <h1>Loading...</h1>
    }
   
 

    return (
        <div>
            
             {"from render", console.log(wantItems)}
            
            <h1>{ wantItems.length && JSON.stringify(wantItems)}</h1>

          
            
            {/* <h1>{wantItems[0].id}</h1> */}
                


           
        </div>
    )
}

export default WantList
