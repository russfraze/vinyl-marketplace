import { useEffect, useState, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, useParams } from 'react-router-dom'
import React, { Component } from 'react'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'


//drop down menu options
const grades = [
    { value: 'Mint', label: 'Mint' },
    { value: 'VG+', label: 'VG+' },
    { value: 'VG', label: 'VG' },
    { value: 'G+', label: 'G+' },
    { value: 'G', label: 'G' },
]
const formatOptions = [
    { value: '12"', label: 'Mint' },
    { value: '12" Maxi Single', label: '12" Maxi Single' },
    { value: '12"', label: '12"' },
    { value: '7"', label: '7"' },
    { value: '45', label: '45' }
]
const genreOptions = [
    { value: 'Reggae', label: 'Reggae' },
    { value: 'Disco Edits', label: 'Disco Edits' },
    { value: 'Disco', label: 'Disco' },
    { value: 'Electronic', label: 'Electronic' },
    { value: 'House', label: 'House' },
    { value: 'Techno', label: 'Techno' }
]

function EditListing() {
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(false)
    const [formData, setFormData] = useState({
        artistTitle: '',
        description: '',
        images: {},
        label: '',
        price: 0,
    })

    const [condition, setCondition] = useState([])
    const [format, setFormat] = useState([])
    const [genreStyle, setGenreStyle] = useState([])

    const {
        artistTitle,
        // condition,
        description,
        // format,
        // genreStyle,
        images,
        label,
        price
    } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const params = useParams()
    const isMounted = useRef(true)

    //redirect if the listing is not from user
    useEffect(() => {
        if(listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('you can not edit that listing')
            navigate('/')
        }
    })


    //fetch listing to edit
    useEffect(() => {
        setLoading(true)
        const fetchListing = async() => {
            const docRef = doc(db, 'listings', params.itemId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                setListing(docSnap.data())
                setFormData({...docSnap.data()})
                setLoading(false)
            } else {
                navigate('/')
                toast.error('Listing does not exist')
            }
        }

        fetchListing()
    },[params.itemId, navigate])

    useEffect(() => {
        if (isMounted) {
            //onAuthStateChanged an observer for changes to the users sign in state
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                } else {
                    navigate('/sign-in')
                }
            })
        }


        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    console.log(formData)

    if (loading) {
        return <h1>Loading ...</h1>
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(formData)
        console.log(condition)
        console.log(format)
        console.log(genreStyle)

        const storeImage = async (image) => {
            //return a new promise 
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                //create the file name
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                //create a storage reference
                const storageRef = ref(storage, 'images/' + fileName)

                //create upload task
                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed',
                    (snapshot) => {
                
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        });
                    }
                );
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        //the object thats sent to database
        const listingData = {
            ...formData,
            imgUrls,
            condition,
            format,
            genreStyle,
            timestamp: serverTimestamp()
        }

        delete listingData.images

        //update listing
        const docRef = doc(db, 'listings', params.itemId )
        await updateDoc(docRef, listingData)

        setLoading(false)

        toast.success('Listing saved')

        navigate(`/landing/${docRef.id}`)
    }

    const onMutate = (e) => {

        //if its a file, put it in the images object
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: e.target.value
            }))
        }

    }


    if (loading) {
        return <h1>Loading...</h1>
    }


    return (
        <div>
            <header>
                Edit Listing
            </header>

            <main>
                <form onSubmit={onSubmit}>

                    <label>Images</label>
                    <input
                        id='images'
                        type='file'
                        accept='.jpg,.png,.jpeg'
                        onChange={onMutate}
                        multiple
                        required
                    />

                    <label>Artist / Title</label>
                    <input
                        id='artistTitle'
                        value={artistTitle}
                        type='text'
                        onChange={onMutate}
                    />

                    <label>Description</label>
                    <input
                        id='description'
                        value={description}
                        type='text'
                        onChange={onMutate}
                    />

                    <label>Condition</label>
                    <Select
                        options={grades}
                        id='condition'
                        value={condition}
                        onChange={setCondition}
                    />
                    <Select
                        options={formatOptions}
                        id='format'
                        value={format}
                        onChange={setFormat}
                    />
                    <Select
                        options={genreOptions}
                        id='genre'
                        value={genreStyle}
                        onChange={setGenreStyle}
                    />

                    <label>Label</label>
                    <input
                        id='label'
                        value={label}
                        type='text'
                        onChange={onMutate}
                    />
                    <label>Price</label>
                    <input
                        id='price'
                        value={price}
                        type='text'
                        onChange={onMutate}
                    />

                    <button type='submit' >
                        Edit Listing
                    </button>

                </form>
            </main>

        </div>
    )

}
export default EditListing
