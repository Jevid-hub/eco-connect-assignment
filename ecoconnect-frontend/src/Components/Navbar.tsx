import { useEffect, useState } from "react";
import { Search, LogIn, BookOpen, LogOut, User } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import Button from "./Button";

export default function Navbar({ searchTerm, onSearchChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedin, setIsLoggedin] = useState(null);

  // Check if user is authenticated
  const checkUser = async () => {
    try {
      await getCurrentUser();
      setIsLoggedin(true);
    } catch {
      setIsLoggedin(false);
    }
  };

  // Re-check on every route change
  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedin(false);
      navigate("/sign-in");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="w-full bg-white">
      <div className="h-1.5 bg-black" />
      <div className="flex items-center gap-6 px-6 py-4 border-b-2 border-[#B5481F]">
        <Link 
      to={'/'}
        className="text-2xl font-bold text-[#B5481F] whitespace-nowrap">
          BioBridge
        </Link>

        <div className="relative flex-1 max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Businesses...."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full bg-gray-100 pl-11 pr-4 py-2.5 text-[#B5481F] placeholder-[#B5481F]/70 outline-none focus:ring-2 focus:ring-[#B5481F]/30"
          />
        </div>

        <div className="flex items-center gap-3 whitespace-nowrap">
          {loggedin === true ? (
            <>
              <Button
                label="Logout"
                variant="outline"
                icon={<LogOut size={16} />}
                onClick={handleLogout}
              />
              <Button
                label="Profile"
                variant="primary"
                icon={<User size={16} />}
                onClick={() => navigate("/profile")}
              />
            </>
          ) : loggedin === false ? (
            <>
              <Button
                label="Login"
                variant="outline"
                icon={<LogIn size={16} />}
                onClick={() => navigate("/sign-in")}
              />
              <Button
                label="Register"
                variant="primary"
                icon={<BookOpen size={16} />}
                onClick={() => navigate("/sign-in")}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </header>
  );
}