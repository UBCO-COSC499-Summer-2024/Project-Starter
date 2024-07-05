'use client'
import Link from 'next/link';
import Image from 'next/image';
import styles from './NavBar.module.css';
import { createClient } from '@supabase/supabase-js/dist/module';
import { useEffect } from 'react';

const NavBar = () => {
    useEffect(()=>{
            (async function(){
                const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY); //copilot
    
                // get user info, semi-copilot
                console.log(await supabase.auth.getUser())
            })()
    },[])
    return (
        <nav className={styles.nav}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link href="/dashboard" className={styles.ubcLogoAndTitle}>
                    <Image src="/ubc_logo.png" alt="UBC Logo" width={50} height={50} style={{ margin: '20px' }} />
                    <h1>CMPS Department Management</h1>
                </Link>
                <Link href="/account" className={styles.profile}>
                    <Image src="/profile_pic_placeholder.jpg" alt="User Profile" width={30} height={30} className={styles.profilePic} />
                    <span>Username</span>
                </Link>
            </div>
            <ul className={styles.navbarButtonsList}>
                <li className={styles.navbarButton}>
                    <Link href="/dashboard" className={styles.navbarButtonText}>
                        DASHBOARD
                    </Link>
                </li>
                <li className={styles.navbarButton}>
                    <Link href="/instructor" className={styles.navbarButtonText}>
                        INSTRUCTORS
                    </Link>
                </li>
                <li className={styles.navbarButton}>
                    <Link href="/courses" className={styles.navbarButtonText}>
                        COURSES
                    </Link>
                </li>
                <li className={styles.navbarButton}>
                    <Link href="/service_roles" className={styles.navbarButtonText}>
                        SERVICE ROLES
                    </Link>
                </li>
                <li className={styles.navbarButton}>
                    <Link href="/evaluations" className={styles.navbarButtonText}>
                        EVALUATIONS
                    </Link>
                </li>
                <li className={styles.navbarButton}>
                    <Link href="/time_tracking" className={styles.navbarButtonText}>
                        TIME TRACKING
                    </Link>
                </li>
                <li className={styles.navbarButton}>
                    <Link href="/tools" className={styles.navbarButtonText}>
                        TOOLS
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
