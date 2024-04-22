import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  About,
  CreateListing,
  Home,
  Listing,
  Profile,
  SignIn,
  SignUp,
  Update,
} from "./pages/index";
import { Header, PrivateRoute } from "./components/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/updatelisitng/:id" element={<Update />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
