import { MutatingDots } from 'react-loader-spinner';
import { useStore } from '../store/store';

type Props = { isActive?: boolean };

const GlobalLoader: React.FC<Props> = ({ isActive }) => {
    const loading = useStore((state) => state.loading);

    if (loading || isActive) {
        return (
            <div className="fixed flex items-center justify-center w-full h-full bg-gray-400 z-30 bg-opacity-50">
                <MutatingDots
                    color="#ED6F00"
                    secondaryColor="#FFFFFF"
                    height={100}
                    width={100}
                />
            </div>
        );
    }
    return '';
};

export default GlobalLoader;
