'use client'
import React from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function TimeTracking() {
    const router = useRouter();
    const fetchUrl = "v_benchmarks_page"; // URL to fetch data from the database view
    const tableName = "service_hours_benchmark"; // Name of the table to update
    const initialSortModel = [
        { field: 'year', sort: 'desc' },
    ];

    // Configuration for the columns in the table
    const columnsConfig = [
        { field: 'id', headerName: 'ID', width: 75, editable: false },
        {
            field: 'instructor_full_name',
            headerName: 'Instructor',
            flex: 1,
            editConfig: { type: 'searchModal', modalType: 'instructor' },
            linkConfig: { prefix: '/instructors/instructor_info?id=', idField: 'instructor_id' }
        },
        { field: 'year', headerName: 'Year', flex: 1, editable: true },
        { field: 'hours', headerName: 'Hours', flex: 1, editable: true }
    ];

    // Handler to update a row in the table
    const rowUpdateHandler = async (row) => {
        const { error } = await supabase
            .from('service_hours_benchmark')
            .update({
                instructor_id: row.instructor_id,
                year: row.year,
                hours: row.hours
            }).eq('benchmark_id', row.id);

        if (error) {
            return { error }; // Ensure error is returned here
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', flexWrap: 'nowrap' }}>
                <h1 style={{ marginRight: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>Service Hours Benchmarks</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button onClick={() => { router.push("/time_tracking") }} variant="contained" color="primary">
                        Back to Time Tracking
                    </Button>
                </div>
            </div>
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                deleteWarningMessage="Are you sure you want to delete these service hours benchmarks?"
                idColumn="benchmark_id"
                uniqueColumns={['instructor_id', 'year']}
            />
        </>
    );
}
