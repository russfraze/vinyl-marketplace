import {Link} from 'react-router-dom'


function ListingItem({item}) {
    return (
        <li className='listingItem'>
            
               
                <div> 
                    <img src={item.imageUrls[0]} ></img>
                    <h3>{item.artistTitle}</h3>
                    <p>$ {item.price}</p>
                    <p>{item.description}</p>
                    <p>Condition Rating: {item.condition}</p>
                    <p>Genre / Style: {item.genreStyle}</p>
                </div>


           
        </li >
    )
}

export default ListingItem
