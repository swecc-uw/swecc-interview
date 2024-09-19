import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import InterviewSignupPage from './pages/InterviewSignupPage';
import Layout from './components/Layout';

import MemberProfilePage from './pages/MemberProfilePage';
import JoinPage from './pages/JoinPage';
import { ViewInterviewsPage } from './pages/ViewInterviewsPage';
import { ViewInterviewPage } from './pages/ViewInterviewPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedPage from './pages/TestPage';
import DevRoute from './components/DevRoute';
import DirectoryPage from './pages/DirectoryPage';
import MemberProfile from './components/MemberProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

import { theme } from './theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route
              path="/interview-signup"
              element={
                <ProtectedRoute>
                  <InterviewSignupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews"
              element={
                <ProtectedRoute>
                  <ViewInterviewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews/:interviewId"
              element={
                <ProtectedRoute>
                  <ViewInterviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MemberProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/join-swecc" element={<JoinPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/directory"
              element={
                <ProtectedRoute>
                  <DirectoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/directory/:userId"
              element={
                <ProtectedRoute>
                  <MemberProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<div>Not Found</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <DevRoute>
                    <ProtectedPage />
                  </DevRoute>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </HashRouter>
    </ChakraProvider>
  );
};

export default App;
