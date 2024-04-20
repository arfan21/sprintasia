import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/store';

type Props = { component: React.ElementType };

const GuestRoute: React.FC<Props> = ({
    component: Component,
    ...rest
}) => {
    const isAuthenticated = useStore(
        (state) => state.isAuthenticated,
    );

    if (isAuthenticated) {
        console.log('redirected to root');
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Component {...rest} />
        </>
    );
};
export default GuestRoute;
