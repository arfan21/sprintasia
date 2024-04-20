import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

const Navbar = () => {
    const setToken = useStore((state) => state.setToken);
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-lg shadow-md px-56 py-8 h-[10%] w-full">
            <div className="w-full flex justify-between items-center">
                <div>
                    <h1
                        className="text-2xl font-bold  text-center cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        Task Management
                    </h1>
                </div>
                <div>
                    <button
                        className=" flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => {
                            setToken('');
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
