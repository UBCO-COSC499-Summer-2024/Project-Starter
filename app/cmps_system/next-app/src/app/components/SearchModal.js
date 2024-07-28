import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import supabase from "@/app/components/supabaseClient";

const SearchModal = ({ open, handleClose, handleSelect, type }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (open) {
            (async () => {
                let data, error;

                if (type === 'instructor') {
                    ({ data, error } = await supabase.from('instructor').select().ilike('first_name', `%${searchQuery}%`));
                    data = data.map(instructor => ({
                        id: instructor.instructor_id,
                        name: `${instructor.last_name}, ${instructor.first_name}`
                    }));
                } else if (type === 'course') {
                    ({ data, error } = await supabase.from('course').select().ilike('course_title', `%${searchQuery}%`));
                    data = data.map(course => ({
                        id: course.course_id,
                        name: `${course.subject_code} ${course.course_num} ${course.section_num}`
                    }));
                } else if (type === 'service_role') {
                    ({ data, error } = await supabase.from('service_role').select().ilike('title', `%${searchQuery}%`));
                    data = data.map(role => ({
                        id: role.service_role_id,
                        name: `${role.title}`
                    }));
                }

                if (error) {
                    console.error("Error fetching data:", error);
                } else {
                    setResults(data);
                }
            })();
        }
    }, [open, searchQuery, type]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2" mb={2}>Select {type}</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <DataGrid
                    rows={results}
                    columns={[{ field: 'name', headerName: `${type} Name`, width: 400 }]}
                    pageSize={5}
                    onRowClick={(params) => {
                        handleSelect(params.row);
                        handleClose();
                    }}
                />
                <Button onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
            </Box>
        </Modal>
    );
};

export default SearchModal;
