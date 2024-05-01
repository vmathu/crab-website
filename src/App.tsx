import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { checkCookie } from '@utils/Cookie';
import { Map, Staff, SignIn } from './pages';
import NewBookingComponent from './pages/staff/components/NewBooking';
import ResolveGPSComponent from './pages/staff/components/ResolveGPS';

export default function RouterHandler() {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const isCookieValid = checkCookie('token');
    setShouldRedirect(!isCookieValid);
  }, []);

  return (
    <BrowserRouter>
      {shouldRedirect && <Navigate to='/sign-in' replace />}
      <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path="/" element={<Map />} />
        <Route
          path="/staff/new-booking"
          element={
            <Staff>
              <NewBookingComponent />
            </Staff>
          }
        />
        <Route
          path="/staff/resolve-gps"
          element={
            <Staff>
              <ResolveGPSComponent />
            </Staff>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}