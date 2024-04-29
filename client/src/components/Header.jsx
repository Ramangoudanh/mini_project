import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser&&currentUser.username === 'ramangoudanh'; 
  return (
    <div className='bg-gray-900'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/' className='text-white text-2xl font-bold'>
          Complaint App
        </Link>
        <ul className='flex gap-4 text-white'>
          <li className='hidden md:block'>
            <Link to='/complaints' className='hover:text-gray-300'>
              {currentUser ?  !isAdmin ?'Add Complaint' : 'Analytics' : ''}
            </Link>
          </li>
          <li className='hidden md:block'>
            <Link to='/my-complaints' className='hover:text-gray-300'>
              {currentUser ? !isAdmin ?'My Complaint' : 'ViewComplaints' : ''}
            </Link>
          </li>
          <li>
            <Link to='/' className='hover:text-gray-300'>
              Home
            </Link>
          </li>
          <li>
            <Link to='/about' className='hover:text-gray-300'>
              About
            </Link>
          </li>
          <li>
            <Link to='/profile' className='hover:text-gray-300'>
              {currentUser ? (
                <img
                  src={currentUser.profilePicture}
                  alt='profile'
                  className='h-7 w-7 rounded-full object-cover'
                />
              ) : (
                'Sign In'
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
