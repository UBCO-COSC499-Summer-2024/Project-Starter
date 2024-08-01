'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Navbar from '@/app/components/NavBar';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from "@/app/components/supabaseClient";

export default function EventsPage() {
    // State to store events data
    const [events, setEvents] = useState([]);
    // Router for navigation
    const { push } = useRouter();
    // State to store user role
    const [userRole, setUserRole] = useState('');

    // useEffect to fetch user role and events on component mount
    useEffect(() => {
        // Fetch user role from Supabase
        async function fetchUserRole() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('user_role')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();
                if (error) {
                    console.error('Error fetching user role:', error);
                } else {
                    setUserRole(data.role);
                }
            }
        }

        // Fetch events from Supabase
        async function fetchEvents() {
            const { data, error } = await supabase.from('event').select();
            if (error) {
                console.error('Error fetching events:', error);
            } else {
                // Format event datetime for better readability
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

        // Call the fetch functions when component mounts
        fetchUserRole();
        fetchEvents();
    }, []);

    // Function to handle event deletion
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                const { error } = await supabase
                    .from('event')
                    .delete()
                    .eq('event_id', id);
                
                if (error) throw error;

                // Update the local state to remove the deleted event
                setEvents(events.filter(event => event.event_id !== id));
                alert('Event deleted successfully.');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event.');
            }
        }
    };

    // Define columns for DataGrid
    const columns = [
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'location', headerName: 'Location', width: 200 },
        { field: 'event_datetime', headerName: 'Time and Date', width: 200 },
        { field: 'duration', headerName: 'Duration', width: 150 },
        { field: 'is_meeting', headerName: 'Is Meeting?', width: 150, type: 'boolean' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 220,
            renderCell: (params) => (
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => push(`/time_tracking/events/event_info?id=${params.row.event_id}`)}
                        sx={{ marginRight: 1, fontSize: '0.8rem', padding: '5px 10px' }}
                    >
                        View Details
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(params.row.event_id)}
                        sx={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <main>
            <Navbar />
            <Container maxWidth={false} style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <h1>Events</h1>
                    {/* Show 'Create New Event' button only for staff and head roles */}
                    {['staff', 'head'].includes(userRole.toLowerCase()) && (
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
