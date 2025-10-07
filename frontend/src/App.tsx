import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/Layout";

// Pages
import { Home } from "./pages/Home";
import Features from "@/pages/Features";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import { SignIn } from "./pages/Signin";
import { SignUp } from "./pages/SignUp";
import { InputOTPForm } from "./pages/InputOTP";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/otp" element={<InputOTPForm />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
