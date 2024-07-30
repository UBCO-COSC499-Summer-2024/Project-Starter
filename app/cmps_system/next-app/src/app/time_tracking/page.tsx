'use client'
import React from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Evaluations() {
    const router = useRouter();
    const fetchUrl = "v_timetracking";
    const tableName = "service_hours_entry";
    const initialSortModel = [
        { field: 'id', sort: 'desc' },
    ];

    const columnsConfig = [
        { field: 'id', headerName: 'ID', width: 75, editable: false },
        {
            field: 'instructor_full_name',
            headerName: 'Instructor',
            flex: 1,
            editConfig: { type: 'searchModal', modalType: 'instructor' },
            linkConfig: { prefix: '/instructors/instructor_info?id=', idField: 'instructor_id' }
        },
        {
            field: 'service_role',
            headerName: 'Service Role',
            flex: 1,
            editConfig: { type: 'searchModal', modalType: 'service_role' },
            linkConfig: { prefix: '/service_roles/service_role_info?id=', idField: 'service_role_id' }
        },
        { field: 'year', headerName: 'Year', flex: 1, editable: true },
        { field: 'month', headerName: 'Month', flex: 1, editable: true },
        { field: 'hours', headerName: 'Hours', flex: 1, editable: true }
    ];

    const rowUpdateHandler = async (row) => {
        const { error } = await supabase
            .from('service_hours_entry')
            .upsert({
                service_hours_entry_id: row.id,
                instructor_id: row.instructor_id,
                service_role_id: row.service_role_id,
                year: row.year,
                hours: row.hours,
                month: row.month
            });

        if (error) {
            return { error }; // Ensure error is returned here
        }
    };


    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <h1 style={{ marginRight: "10px" }}>Time Tracking</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button onClick={() => { router.push("/time_tracking/benchmarks") }} variant="contained" color="primary">
                        Service Hours Benchmarks
                    </Button>
                    <Button onClick={() => { router.push("/time_tracking/events") }} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                        Events
                    </Button>
                </div>
            </div>
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                deleteWarningMessage="Are you sure you want to delete this evaluation?"
                idColumn="service_hours_entry_id"
            />
        </>
    );
}
