'use client'
import Link from 'next/link';
import Image from 'next/image';
import styles from './NavBar.module.css';
import { useEffect, useState } from 'react';
import supabase from "@/app/components/supabaseClient";


const NavBar = () => {
    const [userName, setUserName] = useState('Username');

    useEffect(() => {
        (async function () {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error('Error fetching user session:', sessionError);
                return;
            }
            const user = sessionData?.session?.user;
            if (user) {
                const displayName = user.user_metadata.display_name || user.email;
                setUserName(displayName);
            }
        })();
    }, [supabase]);
    const [Page, setPage] = useState('');
    const tabs = ["DASHBOARD", "INSTRUCTORS", "COURSES", "SERVICE ROLES", "EVALUATIONS", "TIME TRACKING", "TOOLS"];
    return (
        <nav className={styles.nav}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link href="/dashboard" className={styles.ubcLogoAndTitle}>
                    <Image src="/ubc_logo.png" alt="UBC Logo" width={50} height={50} style={{ margin: '20px' }} />
                    <h1>CMPS Department Management</h1>
                </Link>
                <Link href="/account" className={styles.profile}>
                    <Image src="/profile_pic_placeholder.jpg" alt="User Profile" width={30} height={30} className={styles.profilePic} />
                    <span>{userName}</span>
                </Link>
            </div>
            <ul className={styles.navbarButtonsList} style={{fontSize: "small"}}>
                <li className={styles.navbarButton}>
                    <Link href="/dashboard" className={styles.navbarButtonText}>
                        
                    </Link>
                </li>
               
            </ul>
        </nav>
    );
};

export default NavBar;
