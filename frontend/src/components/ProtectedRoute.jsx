import { Route, Redirect } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
function ProtectedRoute({ component: Component, loggedIn, ...props }) {
  return (
    <Route
      {...props}
      render={() =>
        loggedIn ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
}

export default ProtectedRoute;
