import { Link } from 'react-router-dom'

function ListingItem({ item, id, onEdit, onDelete }) {

    return (
        <li className='listingItem'>


            <div>
                <Link className='listingItemLink' to={`/landing/${id}`}>
                    <img className='listingItemImg' src={item.imgUrls[0]} ></img>
                    <div className='listingItemDetails'>
                        <h3>{item.artistTitle}</h3>
                        <p>Genre / Style: {item.genreStyle.value}</p>
                        {/* <p>{item.description}</p> */}
                        <p>Condition Rating: {item.condition.value}</p>
                        <p>$ {item.price}</p>
                    </div>
                </Link>

                {onDelete && (

                    <button className='primaryButton' onClick={() => onDelete(item.id, item.name)}>Delete</button>
                  
                )}

                {onEdit && <button className='primaryButton' onClick={() => onEdit(id)}>Edit</button>}
            </div>

        </li >
    )
}

export default ListingItem
