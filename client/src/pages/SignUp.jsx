import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('https://mini-project-fo4m.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500'>
      <div className='w-full max-w-xl px-8 py-4 bg-white rounded-lg shadow-lg mt-4'>
        <h1 className='text-3xl font-semibold mb-4 text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-lg'>Sign Up</h1>
        <p className='text-gray-600 mb-4 text-center'>Create your account.</p>
        <form onSubmit={handleSubmit} className='mb-4'>
          <div className='mb-2'>
            <label htmlFor='username' className='block text-gray-700 font-medium'>
              Username
            </label>
            <input
              type='text'
              id='username'
              className='w-full mt-1 p-3 border rounded-md'
              placeholder='Username'
              onChange={handleChange}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='email' className='block text-gray-700 font-medium'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='w-full mt-1 p-3 border rounded-md'
              placeholder='Email'
              onChange={handleChange}
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 font-medium'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='w-full mt-1 p-3 border rounded-md'
              placeholder='Password'
              onChange={handleChange}
            />
          </div>
          <div className='text-center'>
            <button
              type='submit'
              className='w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600'
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
            {error && <p className='text-red-500 mt-2'>Sign up failed. Please try again.</p>}
          </div>
        </form>
        <div className='text-center'>
          <button className='flex items-center justify-center w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335" />
              <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853" />
              <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2" />
              <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05" />
            </svg>
            <span className="ml-2">Sign in with Google</span>
          </button>
        </div>
        <div className='text-center mt-2'>
          <p className='text-white'>Already have an account?</p>
          <Link to='/sign-in' className='text-blue-500'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}