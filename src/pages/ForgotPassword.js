import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {useState} from 'react' 
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify'


function ForgotPassword() {
    const [email, setEmail] = useState('')

    const onChange = (e) => {
        setEmail(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('An email was sent to your account')
        } catch (error) {
            toast.error('Could not send reset email')
        }
    }

    const onTry = (e) => {
        toast.error('why dis dont work?')
    }


    return (

        <div>
        <header>
            <h1>Forgot password</h1>
        </header>

        <main>
        <form onSubmit={onSubmit}>
            <label>Email</label>
            <input
            id='email'
            type='email'
            onChange={onChange}
            type='email'
            value={email}

            />
            <button type='submit' >Send Reset Email</button>

            <button onClick={onTry}>Try</button>
        </form>
        <Link to='/sign-in'>
            Sign In 
        </Link>
        </main>
        </div>
    )
}

export default ForgotPassword
