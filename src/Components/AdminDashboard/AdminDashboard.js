import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const displayName = userInfo?.name || userInfo?.email || userInfo?.username || "Admin";

  return (
    <div className="admin_dashboard">
      <h1>Admin Dashboard</h1>
      <p className="admin_welcome">Welcome, {displayName}.</p>
      <p className="admin_sub">Manage your listings and reservations here.</p>
      <nav className="admin_links">
        <Link to="/create-listing" className="admin_link">Create a listing</Link>
        <Link to="/listings" className="admin_link">View listings</Link>
        <Link to="/reservations" className="admin_link">View reservations</Link>
      </nav>
    </div>
  );
};

export default AdminDashboard;
