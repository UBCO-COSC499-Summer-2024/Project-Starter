'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/app/components/NavBar';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import supabase from "@/app/components/supabaseClient";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const { push } = useRouter();
    const userRole = 'Staff'; // Placeholder for user role check (replace with actual role checking logic)

    useEffect(() => {
        async function fetchEvents() {
            const { data, error } = await supabase.from('event').select();
            if (error) {
                console.error('Error fetching events:', error);
            } else {
                const formattedData = data.map(event => ({
                    ...event,
                    event_datetime: new Date(event.event_datetime).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }));
                setEvents(formattedData);
            }
        }
        fetchEvents();
    }, []);

    const columns = [
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'location', headerName: 'Location', width: 200 },
        { field: 'event_datetime', headerName: 'Time and Date', width: 200 },
        { field: 'duration', headerName: 'Duration', width: 150 },
        { field: 'is_meeting', headerName: 'Is Meeting?', width: 150, type: 'boolean' },
    ];

    return (
        <main>
            <Navbar />
            <Container maxWidth={false} style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <h1>Events</h1>
                    {(userRole === 'Staff' || userRole === 'Head') && (
                        <Button
                            onClick={() => push('/time_tracking/events/create_new_event')}
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                        >
                            Create New Event
                        </Button>
                    )}
                </Box>
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={events}
                        columns={columns}
                        pageSize={10}
                        autoHeight
                        getRowId={(row) => row.event_id}
                    />
                </div>
            </Container>
        </main>
    );
}
