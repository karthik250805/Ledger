import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import CustomerDetails from "./pages/CustomerDetails/CustomerDetails";
import LoanDetails from "./pages/Loans/LoanDetails";
import Dashboard from "./pages/Dashboard/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Recurring from "./pages/Recurring/Recurring";
import Profile from "./pages/Profile/Profile";


export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    PUBLIC ROUTES
                    No Sidebar
                ================================================= */}


                
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* =================================================
                    PROTECTED HOME
                    Sidebar visible
                ================================================= */}

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>

                            <Layout>

                                <Home />

                            </Layout>

                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>

                            <Layout>

                                <Profile />

                            </Layout>

                        </ProtectedRoute>
                    }
                />
                

                <Route
                    path="/recurring"
                    element={
                        <ProtectedRoute>

                            <Layout>

                                <Recurring />

                            </Layout>

                        </ProtectedRoute>
                    }
                />




                {/* =================================================
                    PROTECTED DASHBOARD
                    Sidebar visible
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>

                            <Layout>

                                <Dashboard />

                            </Layout>

                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    PROTECTED CUSTOMER DETAILS
                    Sidebar visible
                ================================================= */}

                <Route
                    path="/customer/:id"
                    element={
                        <ProtectedRoute>

                            <Layout>

                                <CustomerDetails />

                            </Layout>

                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    PROTECTED LOAN DETAILS
                    Sidebar visible
                ================================================= */}

                <Route
                    path="/loan/:loanId"
                    element={
                        <ProtectedRoute>

                            <Layout>

                                <LoanDetails />

                            </Layout>

                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}