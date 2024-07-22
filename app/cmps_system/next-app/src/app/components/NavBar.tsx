'use client'
// gpt aided
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js/dist/module';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const pages = [
    { name: "📊Dashboard", url: "/dashboard" },
    { name: "👩🏻‍🏫Instructors", url: "/instructors" },
    { name: "📖Courses", url: "/courses" },
    { name: "💼Service Roles", url: "/service_roles" },
    { name: "💯Evaluations", url: "/evaluations" },
    { name: "🕒Service Roles Tracking", url: "/time_tracking" },
    { name: "🎯Benchmark", url: "/time_tracking/benchmarks" },
    { name: "🛠️Tools", url: "/tools" },
];

const NavBar = () => {
    const [email, setEmail] = useState("")
    useEffect(() => {
        (async function () {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY); //copilot

            // get user info, semi-copilot
            const user = await supabase.auth.getUser()
            console.log(user)
            setEmail(user.data.user.email)
        })()
    }, [])
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#0055B7" }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    CMPS Management System
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {pages.map((page, index) => (
                        <a key={index} href={page.url} style={{ color: "white", paddingLeft: "10px", fontSize: "small", textDecoration: "none" }}>
                            {page.name}
                        </a>
                    ))}
                </Box>
              
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
