'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import necessary hooks
import { Container, Typography, TextField, Button, Modal, Box, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '@/app/components/NavBar';
import supabase from "@/app/components/supabaseClient";
import styles from './ServiceRoleInfo.module.css'; // Import custom CSS

export default function ServiceRoleInfo() {
    const [serviceRole, setServiceRole] = useState(null);
    const [originalServiceRole, setOriginalServiceRole] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ instructor_id: '', start_date: '', end_date: '', expected_hours: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [userRole, setUserRole] = useState(''); // Initialize userRole state
    const router = useRouter();
    const searchParams = useSearchParams(); // Use useSearchParams to get query parameters
    const serviceRoleId = searchParams.get('id'); // Extract the 'id' from the URL

    useEffect(() => {
        const fetchUserRole = async () => {
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
                    setUserRole(data.role); // Set userRole state
                }
            }
        };

        const fetchServiceRole = async () => {
            try {
                const { data, error } = await supabase
                    .from('service_role')
                    .select('*')
                    .eq('service_role_id', serviceRoleId)
                    .single();

                if (error) throw error;

                setServiceRole(data);
                setOriginalServiceRole(data); // Store the original state
            } catch (error) {
                console.error('Error fetching service role:', error);
            }
        };

        const fetchAssignments = async () => {
            try {
                const { data, error } = await supabase
                    .from('v_service_role_assign')
                    .select('*, instructor (first_name, last_name)')
                    .eq('service_role_id', serviceRoleId);

                if (error) throw error;

                setAssignments(data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        const fetchInstructors = async () => {
            try {
                const { data, error } = await supabase
                    .from('instructor')
                    .select('*');

                if (error) throw error;

                setInstructors(data);
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };

        if (serviceRoleId) {
            fetchUserRole();
            fetchServiceRole();
            fetchAssignments();
            fetchInstructors();
        }
    }, [serviceRoleId]); // Depend on serviceRoleId to refetch when it changes

    const handleFieldChange = (field) => (event) => {
        setServiceRole({ ...serviceRole, [field]: event.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            const { error } = await supabase
                .from('service_role')
                .update(serviceRole)
                .eq('service_role_id', serviceRoleId);

            if (error) throw error;

            setSnackbarMessage('Service role updated successfully.');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error updating service role:', error);
            setSnackbarMessage('Failed to update service role.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleDiscardChanges = () => {
        setServiceRole(originalServiceRole); // Revert to the original state
    };

    const handleAddAssignment = async () => {
        try {
            const { data: existingAssignment, error: fetchError } = await supabase
                .from('service_role_assign')
                .select('*')
                .eq('instructor_id', newAssignment.instructor_id)
                .eq('service_role_id', serviceRoleId);

            if (fetchError) throw fetchError;

            if (existingAssignment.length > 0) {
                setSnackbarMessage('This instructor is already assigned to this service role.');
                setSnackbarSeverity('warning');
                setSnackbarOpen(true);
                return;
            }

            const { data, error } = await supabase
                .from('service_role_assign')
                .insert([{
                    instructor_id: newAssignment.instructor_id,
                    service_role_id: serviceRoleId,
                    start_date: newAssignment.start_date,
                    end_date: newAssignment.end_date,
                    expected_hours: newAssignment.expected_hours
                }])
                .select();

            if (error) throw error;

            setAssignments(prev => [...prev, ...data]);
            setSnackbarMessage('Assignment added successfully.');
            setSnackbarSeverity('success');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding assignment:', error.message); // Log the detailed error message
            setSnackbarMessage('Failed to add assignment: ' + error.message);
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleDeleteAssignment = async (id) => {
        try {
            const { error } = await supabase
                .from('service_role_assign')
                .delete()
                .eq('service_role_assign_id', id);

            if (error) throw error;

            setAssignments(prev => prev.filter(a => a.service_role_assign_id !== id));
            setSnackbarMessage('Assignment deleted successfully.');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error deleting assignment:', error);
            setSnackbarMessage('Failed to delete assignment.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        {
            field: 'instructor_id', headerName: 'Assignee', width: 200, renderCell: (params) => {
                const instructor = instructors.find(inst => inst.instructor_id === params.value);
                return instructor ? `${instructor.first_name} ${instructor.last_name}` : '';
            }
        },
        { field: 'start_date', headerName: 'Start Date', width: 150, editable: ['staff', 'head'].includes(userRole.toLowerCase()) },
        { field: 'end_date', headerName: 'End Date', width: 150, editable: ['staff', 'head'].includes(userRole.toLowerCase()) },
        { field: 'expected_hours', headerName: 'Expected Hours', width: 150, editable: ['staff', 'head'].includes(userRole.toLowerCase()) },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                ['staff', 'head'].includes(userRole.toLowerCase()) && (
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteAssignment(params.row.service_role_assign_id)}
                        color="inherit"
                    />
                )
            ),
        },
    ];

    return (
        <main>
            <Navbar />
            <Container maxWidth="md">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Service Role Info
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => router.push('/service_roles')} // Go back to service roles page
                    >
                        Go Back
                    </Button>
                </Box>
                {serviceRole && (
                    <div>
                        <TextField
                            label="Title"
                            fullWidth
                            value={serviceRole.title}
                            onChange={handleFieldChange('title')}
                            margin="normal"
                            variant="outlined"
                            className={!['staff', 'head'].includes(userRole.toLowerCase()) ? styles.nonEditable : ''}
                            InputProps={{
                                readOnly: !['staff', 'head'].includes(userRole.toLowerCase()),
                            }}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            value={serviceRole.description}
                            onChange={handleFieldChange('description')}
                            margin="normal"
                            variant="outlined"
                            className={!['staff', 'head'].includes(userRole.toLowerCase()) ? styles.nonEditable : ''}
                            InputProps={{
                                readOnly: !['staff', 'head'].includes(userRole.toLowerCase()),
                            }}
                        />
                        <TextField
                            label="Building"
                            fullWidth
                            value={serviceRole.building}
                            onChange={handleFieldChange('building')}
                            margin="normal"
                            variant="outlined"
                            className={!['staff', 'head'].includes(userRole.toLowerCase()) ? styles.nonEditable : ''}
                            InputProps={{
                                readOnly: !['staff', 'head'].includes(userRole.toLowerCase()),
                            }}
                        />
                        <TextField
                            label="Room Number"
                            fullWidth
                            value={serviceRole.room_num}
                            onChange={handleFieldChange('room_num')}
                            margin="normal"
                            variant="outlined"
                            className={!['staff', 'head'].includes(userRole.toLowerCase()) ? styles.nonEditable : ''}
                            InputProps={{
                                readOnly: !['staff', 'head'].includes(userRole.toLowerCase()),
                            }}
                        />
                        <TextField
                            label="Default Expected Hours"
                            fullWidth
                            value={serviceRole.default_expected_hours}
                            onChange={handleFieldChange('default_expected_hours')}
                            margin="normal"
                            variant="outlined"
                            className={!['staff', 'head'].includes(userRole.toLowerCase()) ? styles.nonEditable : ''}
                            InputProps={{
                                readOnly: !['staff', 'head'].includes(userRole.toLowerCase()),
                            }}
                        />
                        <Box mt={2}>
                            {['staff', 'head'].includes(userRole.toLowerCase()) && (
                                <>
                                    <Button variant="contained" color="primary" onClick={handleSaveChanges} style={{ marginRight: '10px' }}>
                                        Save Changes
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={handleDiscardChanges}>
                                        Discard Changes
                                    </Button>
                                </>
                            )}
                        </Box>
                    </div>
                )}
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                    <Typography variant="h5" component="h2">
                        Assignees
                    </Typography>
                    {['staff', 'head'].includes(userRole.toLowerCase()) && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add New Assignment
                        </Button>
                    )}
                </Box>
                <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
                    <DataGrid
                        rows={assignments}
                        columns={columns}
                        pageSize={5}
                        autoHeight
                        getRowId={(row) => row.service_role_assign_id}
                    />
                </div>

                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Box sx={{ ...modalStyle }}>
                        <Typography variant="h6" component="h2">
                            Add New Assignment
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="instructor-select-label">Instructor</InputLabel>
                            <Select
                                labelId="instructor-select-label"
                                value={newAssignment.instructor_id}
                                onChange={(e) => setNewAssignment({ ...newAssignment, instructor_id: e.target.value })}
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
                        <TextField
                            label="Start Date"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={newAssignment.start_date}
                            onChange={(e) => setNewAssignment({ ...newAssignment, start_date: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="End Date"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={newAssignment.end_date}
                            onChange={(e) => setNewAssignment({ ...newAssignment, end_date: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Expected Hours"
                            fullWidth
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            value={newAssignment.expected_hours}
                            onChange={(e) => setNewAssignment({ ...newAssignment, expected_hours: e.target.value })}
                            margin="normal"
                            required
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddAssignment}
                            style={{ marginTop: '20px' }}
                        >
                            Add Assignment
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