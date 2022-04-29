import {Link} from 'react-router-dom'


function ListingItem({item}) {
    return (
        <li className='listingItem'>
            
               
                <div> 
                    <img src={item.imgUrls[0]} ></img>
                    <h3>{item.artistTitle}</h3>
                    <p>Genre / Style: {item.genreStyle.value}</p> 
                    <p>{item.description}</p>
                    <p>Condition Rating: {item.condition.value}</p>
                    <p>$ {item.price}</p>
                </div>


           
        </li >
    )
}

export default ListingItem
