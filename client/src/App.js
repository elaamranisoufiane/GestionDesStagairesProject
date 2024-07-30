import "./App.css";
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './pages/comps/Navbar';
import Footer from "./pages/comps/Footer";
import axios from 'axios';
//add for photo editor


// Lazy-loaded components
const Dashboard = lazy(() => import("./pages/dashborad/dashboard"));


//error 404
const NotFoundPage = lazy(() => import("./pages/More/NotFoundPage"));

const Users = lazy(() => import("./pages/admin/index"));
const Add = lazy(() => import("./pages/admin/add"));
const Edit = lazy(() => import("./pages/admin/edit"));

// stagaires 
const UsersIntern = lazy(() => import("./pages/intern/index"));
const AddIntern = lazy(() => import("./pages/intern/add"));
const EditIntern = lazy(() => import("./pages/intern/edit"));

const Projects = lazy(() => import("./pages/dashborad/projects"))



const Profile = lazy(() => import("./pages/profile/profile"));

const ValidationEmailFail = lazy(() => import("./pages/More/VerificationFailedPage"));
const ValidationEmailSuccess = lazy(() => import("./pages/More/EmailVerifiedPage"));


const ResetPassword = lazy(() => import("./pages/More/resetPassword"));

const HomeTest = lazy(() => import("./pages/auth/home"));


const checkAuth = async () => {
  try {
    const response = await axios.get('/checkAuthUser', {
      withCredentials: true,
    });
    const isAuthenticated = JSON.stringify(response.data);
    return response.data
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

const isAuthenticated = await checkAuth().then((result) => {
  return result;
});

const getUser = async () => {
  try {
    const response = await axios.get('/getuser', {
      withCredentials: true,
    });
    const isAuthenticated = JSON.stringify(response.data.role);

    return response.data.role
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};
const role = await getUser().then((result) => {
  return result;
});


const App = () => {
  return (
    <div>
      {isAuthenticated ? (
        <Navbar />
      ) : null}

      <BrowserRouter>
        <Routes>
          {!isAuthenticated ? (
            <Route path="/" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><HomeTest /></Suspense>} />
          ) :
            (<Route path="/" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><Dashboard /></Suspense>} />)
          }
          <Route path="/email-verified" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><ValidationEmailSuccess /></Suspense>} />

          {!isAuthenticated ? (
            <>
              <Route path="/email-failed" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><ValidationEmailFail /></Suspense>} />
              <Route path="/reset-password/:token/:userId" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><ResetPassword /></Suspense>} />
            </>
          ) : null}

          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><Dashboard /></Suspense>} />
              <Route path="/projects" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><Projects /></Suspense>} />
              <Route path="/intern/index" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><UsersIntern /></Suspense>} />
              {role === 'admin' || role === 'user' ? (
                <>
                  <Route path="/intern/add" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><AddIntern /></Suspense>} />
                  <Route path="/intern/edit/:id" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><EditIntern /></Suspense>} />
                </>
              ) : null}

              {role === 'admin' ? (
                <>
                  <Route path="/admin/index" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><Users /></Suspense>} />
                  <Route path="/admin/add" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><Add /></Suspense>} />
                  <Route path="/admin/edit/:id" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><Edit /></Suspense>} />

                </>
              ) : null}
              <Route path="/profile" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><Profile /></Suspense>} />
            </>
          ) : (
            <>
            </>
          )}
          <Route path="*" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><NotFoundPage /></Suspense>} />
          <Route path="/404" element={<Suspense fallback={<div className="h-full min-h-screen"> </div>}><NotFoundPage /></Suspense>} />
        </Routes>
      </BrowserRouter>

      {isAuthenticated ? (
        <Footer />
      ) : null}

    </div>
  );
}

export default App;

