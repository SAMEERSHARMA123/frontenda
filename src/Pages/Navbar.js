import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ isAuthenticated, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close mobile menu when route changes
    setMenuOpen(false);
    
    // Get user role from localStorage if authenticated
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserRole(user.role || 'user');
    }
  }, [location, isAuthenticated]);

  const navLinks = {
    user: [
      { name: "Book Appointment", href: "/book-appointment" },
      { name: "My Appointments", href: "/my-appointments" },
    ],
    admin: [
      { name: "All Bookings", href: "/admin/bookings" },
      { name: "Manage Slots", href: "/admin/slots" },
    ]
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  // Don't show navbar on login/register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
            🏥 DoctorApp
          </Link>

          {isAuthenticated ? (
            <>
              <div className="hidden md:flex space-x-6">
                {navLinks[userRole]?.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-5 w-5 mr-1" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogIn className="h-5 w-5 mr-1" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium"
              >
                <UserPlus className="h-5 w-5 mr-1" /> Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              {navLinks[userRole]?.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" /> Login
                </div>
              </Link>
              <Link
                to="/register"
                className="block bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium text-center"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center justify-center">
                  <UserPlus className="h-5 w-5 mr-2" /> Register
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
