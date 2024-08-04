import React from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Routes, Route, HashRouter } from 'react-router-dom'
import InterviewSignupPage from './pages/InterviewSignupPage'
import Layout from './components/Layout'
import { MemberProvider } from './context/MemberContex'
import MemberProfilePage from './pages/MemberProfilePage'
import JoinPage from './pages/JoinPage'
import { ViewInterviewsPage } from './pages/ViewInterviewsPage'
import { ViewInterviewPage } from './pages/ViewInterviewPage'
import DirectoryPage from './pages/DirectoryPage'
import MemberProfile from './components/MemberProfile'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  }
})

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <MemberProvider>
          <Layout>
            <Routes>
              <Route
                path='/interview-signup'
                element={<InterviewSignupPage />}
              />
              <Route path='/interviews' element={<ViewInterviewsPage />} />
              <Route
                path='/interviews/:interviewId'
                element={<ViewInterviewPage />}
              />
              <Route path='/profile' element={<MemberProfilePage />} />
              <Route path='/join-swecc' element={<JoinPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/directory/:userId" element={<MemberProfile />} />
              <Route path='/' element={<div>Home</div>} />
              <Route path='*' element={<div>Not Found</div>} />
            </Routes>
          </Layout>
        </MemberProvider>
      </HashRouter>
    </ChakraProvider>
  )
}

export default App
