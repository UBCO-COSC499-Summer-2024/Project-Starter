'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Container, Typography, Modal, Box, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '@/app/components/NavBar';
import supabase from "@/app/components/supabaseClient";

export default function EventInfo() {
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newInstructor, setNewInstructor] = useState('');
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [seconds, setSeconds] = useState('00');
    const [instructors, setInstructors] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const eventId = searchParams.get('id');
    const userRole = 'Staff'; // Placeholder for actual role-checking logic

    useEffect(() => {
        async function fetchEventInfo() {
            const { data: eventData, error: eventError } = await supabase
                .from('event')
                .select('*')
                .eq('event_id', eventId)
                .single();
            
            if (eventError) {
                console.error('Error fetching event data:', eventError);
            } else {
                setEvent(eventData);
                // Fetch attendees information
                const { data: attendeeData, error: attendeeError } = await supabase
                    .from('event_attendance')
                    .select('instructor_id, attendance_duration')
                    .eq('event_id', eventId);
                
                if (attendeeError) {
                    console.error('Error fetching attendees:', attendeeError);
                } else {
                    setAttendees(attendeeData);
                }
            }
        }

        async function fetchInstructors() {
            const { data: instructorData, error: instructorError } = await supabase
                .from('instructor')
                .select('*');
            
            if (instructorError) {
                console.error('Error fetching instructors:', instructorError);
            } else {
                setInstructors(instructorData);
            }
        }

        fetchEventInfo();
        fetchInstructors();
    }, [eventId]);

    const handleAddAttendance = async () => {
        if (!newInstructor || (hours === '00' && minutes === '00' && seconds === '00')) {
            setSnackbarMessage('Please fill in all fields.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const eventDuration = new Date(`1970-01-01T${event.duration}Z`);
        const attendanceDuration = new Date(`1970-01-01T${hours}:${minutes}:${seconds}Z`);

        if (attendanceDuration > eventDuration) {
            setSnackbarMessage('Attendance duration cannot exceed event duration.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const { data, error } = await supabase
            .from('event_attendance')
            .insert([{ instructor_id: newInstructor, attendance_duration: `${hours}:${minutes}:${seconds}`, event_id: eventId }]);

        if (error) {
            console.error('Error adding attendance:', error);
            setSnackbarMessage('Failed to add attendance.');
            setSnackbarSeverity('error');
        } else {
            setAttendees(prev => [...prev, { instructor_id: newInstructor, attendance_duration: `${hours}:${minutes}:${seconds}` }]);
            setSnackbarMessage('Attendance added successfully.');
            setSnackbarSeverity('success');
            setIsModalOpen(false);
        }

        setSnackbarOpen(true);
    };

    const handleDeleteAttendance = async (instructorId) => {
        const { error } = await supabase
            .from('event_attendance')
            .delete()
            .eq('event_id', eventId)
            .eq('instructor_id', instructorId);

        if (error) {
            console.error('Error deleting attendance:', error);
            setSnackbarMessage('Failed to delete attendance.');
            setSnackbarSeverity('error');
        } else {
            setAttendees(prev => prev.filter(attendee => attendee.instructor_id !== instructorId));
            setSnackbarMessage('Attendance deleted successfully.');
            setSnackbarSeverity('success');
        }

        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'instructor_id', headerName: 'Instructor', width: 200, renderCell: (params) => {
            const instructor = instructors.find(inst => inst.instructor_id === params.value);
            return instructor ? `${instructor.first_name} ${instructor.last_name}` : '';
        }},
        { field: 'attendance_duration', headerName: 'Duration', width: 150, editable: userRole === 'Staff' || userRole === 'Head' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteAttendance(params.row.instructor_id)}
                    color="inherit"
                />
            ),
        },
    ];

    const durationOptions = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

    return (
        <main>
            <Navbar />
            <Container maxWidth="md">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" component="h1">
                        Event Info
                    </Typography>
                    <Box>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => setIsModalOpen(true)}
                            style={{ marginRight: '10px' }}
                        >
                            Add Instructor Attendance
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="primary"
                            onClick={() => push('/time_tracking/events')}
                        >
                            Go Back
                        </Button>
                    </Box>
                </Box>
                {event && (
                    <>
                        <Typography variant="h6">Description: {event.description}</Typography>
                        <Typography variant="h6">Location: {event.location}</Typography>
                        <Typography variant="h6">Date and Time: {new Date(event.event_datetime).toLocaleString()}</Typography>
                        <Typography variant="h6">Duration: {event.duration}</Typography>
                        <Typography variant="h6">Is Meeting: {event.is_meeting ? 'Yes' : 'No'}</Typography>
                    </>
                )}
                <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
                    <DataGrid
                        rows={attendees}
                        columns={columns}
                        pageSize={5}
                        autoHeight
                        getRowId={(row) => `${row.event_id}-${row.instructor_id}`}
                    />
                </div>

                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Box sx={{ ...modalStyle }}>
                        <Typography variant="h6" component="h2">
                            Add Instructor Attendance
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="instructor-select-label">Instructor</InputLabel>
                            <Select
                                labelId="instructor-select-label"
                                value={newInstructor}
                                onChange={(e) => setNewInstructor(e.target.value)}
                                label="Instructor"
                                required
                            >
                                {instructors.map((instructor) => (
                                    <MenuItem key={instructor.instructor_id} value={instructor.instructor_id}>
                                        {`${instructor.first_name} ${instructor.last_name}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Hours</InputLabel>
                            <Select value={hours} onChange={(e) => setHours(e.target.value)} required>
                                {durationOptions.slice(0, 24).map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Minutes</InputLabel>
                            <Select value={minutes} onChange={(e) => setMinutes(e.target.value)} required>
                                {durationOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Seconds</InputLabel>
                            <Select value={seconds} onChange={(e) => setSeconds(e.target.value)} required>
                                {durationOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleAddAttendance} 
                            style={{ marginTop: '20px' }}
                        >
                            Add Attendance
                        </Button>
                    </Box>
                </Modal>

                <Snackbar 
                    open={snackbarOpen} 
                    autoHideDuration={6000} 
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </main>
    );
}

// Add styles for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
