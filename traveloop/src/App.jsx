import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import BuildItinerary from './pages/BuildItinerary';
import TripDetail from './pages/TripDetail';
import ItineraryView from './pages/ItineraryView';
import Profile from './pages/Profile';
import SearchPage from './pages/SearchPage';
import CitySearch from './pages/CitySearch';
import Community from './pages/Community';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import TripBudget from './pages/TripBudget';
import SharedItinerary from './pages/SharedItinerary';
import AdminPanel from './pages/AdminPanel';
import Invoice from './pages/Invoice';
import AIChatbot from './components/AIChatbot';
import { TravelPlannerProvider } from './context/TravelPlannerContext';

export default function App() {
  return (
    <TravelPlannerProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/new" element={<CreateTrip />} />
          <Route path="/trips/:id" element={<TripDetail />} />
          <Route path="/trips/:id/itinerary" element={<ItineraryView />} />
          <Route path="/trips/:id/itinerary/build" element={<BuildItinerary />} />
          <Route path="/trips/:id/checklist" element={<PackingChecklist />} />
          <Route path="/trips/:id/notes" element={<TripNotes />} />
          <Route path="/trips/:id/budget" element={<TripBudget />} />
          <Route path="/trips/:id/invoice" element={<Invoice />} />
          <Route path="/trips/:id/share" element={<SharedItinerary />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cities" element={<CitySearch />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <AIChatbot />
      </BrowserRouter>
    </TravelPlannerProvider>
  );
}
