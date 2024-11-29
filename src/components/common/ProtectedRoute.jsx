import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../../utils/auth';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (!auth.isAuthenticated()) {
                    return <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }} />;
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default ProtectedRoute;
