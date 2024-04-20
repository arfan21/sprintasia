import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/store';

type Props = { component: React.ElementType };

const GuardRoute: React.FC<Props> = ({
    component: Component,
    ...rest
}) => {
    const isAuthenticated = useStore(
        (state) => state.isAuthenticated,
    );

    if (!isAuthenticated) {
        console.log('redirected to login');
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Component {...rest} />
        </>
    );
};
export default GuardRoute;
