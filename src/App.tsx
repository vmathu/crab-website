import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Map, Staff } from './pages';
import NewBookingComponent from './pages/staff/components/NewBooking';
import ResolveGPSComponent from './pages/staff/components/ResolveGPS';

export default function RouterHandler() {
  return (
    <BrowserRouter>
      <Routes>
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
