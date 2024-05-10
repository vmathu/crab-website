import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { checkCookie, getRoleFromCookie } from '@utils/Cookie';
import { Staff, SignIn } from './pages';
import NewBookingComponent from './pages/staff/components/NewBooking';
import ResolveGPSComponent from './pages/staff/components/ResolveGPS';
import Admin from './pages/admin';
import Members from './pages/admin/members';
import Statistics from './pages/admin/statistics';
import './App.css';

const role = getRoleFromCookie('token');

function NavigationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const isCookieValid = checkCookie('token');
    const hasNavigated = localStorage.getItem('hasNavigated');

    if (isCookieValid && !hasNavigated) {
      navigate(`/${role}`);
      localStorage.setItem('hasNavigated', 'true');
    } else if (!isCookieValid) {
      navigate('/sign-in');
    }
  }, []);

  return null;
}

function PrivateRoute({
  element,
  roles,
}: {
  element: React.ReactNode;
  roles: string[];
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!roles.includes(role)) {
      navigate(`/${role}`);
    }
  }, []);

  return element;
}

export default function RouterHandler() {
  return (
    <BrowserRouter>
      <NavigationHandler />
      <Routes>
        <Route index element={<PrivateRoute roles={[]} element={<></>} />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/staff'>
          <Route index element={<Navigate to='/staff/new-booking' />} />
          <Route
            path='new-booking'
            element={
              <PrivateRoute
                roles={['staff']}
                element={
                  <Staff>
                    <NewBookingComponent />
                  </Staff>
                }
              />
            }
          />
          <Route
            path='resolve-gps'
            element={
              <PrivateRoute
                roles={['staff']}
                element={
                  <Staff>
                    <ResolveGPSComponent />
                  </Staff>
                }
              />
            }
          />
        </Route>
        <Route path='/admin'>
          <Route index element={<Navigate to='/admin/members' />} />
          <Route
            path='members'
            element={
              <PrivateRoute
                roles={['admin']}
                element={
                  <Admin>
                    <Members />
                  </Admin>
                }
              />
            }
          />
          <Route
            path='statistics'
            element={
              <PrivateRoute
                roles={['admin']}
                element={
                  <Admin>
                    <Statistics />
                  </Admin>
                }
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
