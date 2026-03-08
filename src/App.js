/**
 * Root app: router, global layout (Header, Footer), route definitions,
 * and global Modal/Toast/ErrorBoundary. Protected routes require login.
 */
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import SearchPage from "./Components/SearchPage/SearchPage";
import Modal from "./Components/Modal/Modal";
import Toast from "./Components/Toast/Toast";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import CreateListing from "./Components/CreateListing/CreateListing";
import ViewListings from "./Components/ViewListings/ViewListings";
import EditListing from "./Components/EditListing/EditListing";
import ListingDetail from "./Components/ListingDetail/ListingDetail";
import InfoPage from "./Components/InfoPage/InfoPage";
import NotFound from "./Components/NotFound/NotFound";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ExperiencesPage from "./Components/ExperiencesPage/ExperiencesPage";
import OnlineExperiencesPage from "./Components/OnlineExperiencesPage/OnlineExperiencesPage";
import GiftCardsPage from "./Components/GiftCardsPage/GiftCardsPage";
import Reservations from "./Components/Reservations/Reservations";

const App = () => {
  return (
    <ErrorBoundary>
      <div className="app">
        <Router>
          <ScrollToTop />
          <Header />
          <div className="app_content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/experiences"
            element={
              <ProtectedRoute>
                <ExperiencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/online-experiences"
            element={
              <ProtectedRoute>
                <OnlineExperiencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gift-cards"
            element={
              <ProtectedRoute>
                <GiftCardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listing/:id"
            element={
              <ProtectedRoute>
                <ListingDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/info/:topic"
            element={
              <ProtectedRoute>
                <InfoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings"
            element={
              <ProtectedRoute>
                <ViewListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/edit/:id"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
          </div>
          <Modal />
          <Toast />
          <Footer />
        </Router>
      </div>
    </ErrorBoundary>
  );
};

export default App;

