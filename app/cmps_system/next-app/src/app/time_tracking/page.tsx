'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, Typography, Box, styled, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Navbar from "@/app/components/NavBar";
import supabase from "@/app/components/supabaseClient";
import CMPS_Table from '@/app/components/CMPS_Table';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? '#DAE2ED' : '#303740'};
    background: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? '#6B7A90' : '#DAE2ED'};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? '#1C2025' : '#F3F6F9'};
    &:hover {
      border-color: '#3399FF';
    }
    &:focus {
      border-color: '#3399FF';
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? '#0072E5' : '#b6daff'};
    }
    &:focus-visible {
      outline: 0;
    }
  `,
);

export default function TimeTracking() {
    const router = useRouter();
    const [instructors, setInstructors] = useState([]);
    const [serviceRoles, setServiceRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const ins = await supabase.from("list_of_instructors").select();
                const ser_roles = await supabase.from("list_all_service_roles").select();
                setServiceRoles(ser_roles.data.map((service_role) => service_role.service_role_name));
                setInstructors(ins.data.map((instructor) => instructor.name));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchUrl = "v_timetracking";
    const tableName = "service_hours_entry";
    const initialSortModel = [
        { field: 'instructor_name', sort: 'asc' },
    ];

    const columnsConfig = [
        {
            field: 'instructor_name',
            headerName: 'Instructor',
            flex: 1,
            editConfig: { type: 'searchModal', modalType: 'instructor' },
            linkConfig: { prefix: '/instructors/instructor_info?id=', idField: 'instructor_id' }
        },
        {
            field: 'service_role_name',
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
                year: row.year,
                hours: row.hours,
                month: row.month,
                service_role_id: row.service_role_
            });

        if (error) {
            return { error };
        }
    };

    return (
        <main>
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

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <CMPS_Table
                    fetchUrl={fetchUrl}
                    columnsConfig={columnsConfig}
                    initialSortModel={initialSortModel}
                    tableName={tableName}
                    rowUpdateHandler={rowUpdateHandler}
                    idColumn="service_hours_entry_id"
                    deleteWarningMessage="Are you sure you want to delete the selected time entries? This action is not recoverable!"
                />
            )}
        </main>
    );
}
