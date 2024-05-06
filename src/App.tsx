import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { checkCookie } from '@utils/Cookie';
import { Map, Staff, SignIn } from './pages';
import NewBookingComponent from './pages/staff/components/NewBooking';
import ResolveGPSComponent from './pages/staff/components/ResolveGPS';
import Admin from './pages/admin';
import Members from './pages/admin/members';

function NavigationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const isCookieValid = checkCookie('token');
    const hasNavigated = localStorage.getItem('hasNavigated');

    if (isCookieValid && !hasNavigated) {
      navigate('/staff/new-booking');
      localStorage.setItem('hasNavigated', 'true');
    } else if (!isCookieValid) {
      navigate('/sign-in');
    }
  }, []);

  return null;
}

export default function RouterHandler() {
  return (
    <BrowserRouter>
      <NavigationHandler />
      <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/' element={<Map />} />
        <Route
          path='/staff/new-booking'
          element={
            <Staff>
              <NewBookingComponent />
            </Staff>
          }
        />
        <Route
          path='/staff/resolve-gps'
          element={
            <Staff>
              <ResolveGPSComponent />
            </Staff>
          }
        />
        <Route path='/admin'>
          <Route
            index
            element={
              <Admin>
                <Members />
              </Admin>
            }
          />
          <Route
            path='members'
            element={
              <Admin>
                <Members />
              </Admin>
            }
          />
          <Route
            path='statistics'
            element={
              <Admin>
                <></>
              </Admin>
            }
          />
          <Route
            path='*'
            element={
              <Admin>
                <Members />
              </Admin>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
