import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import supabase from "@/app/components/supabaseClient";

const SearchModal = ({ open, handleClose, handleSelect, type }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [yearRange, setYearRange] = useState([2000, new Date().getFullYear()]); // Example range

    useEffect(() => {
        if (open) {
            (async () => {
                let data, error;
                let query = '';

                if (type === 'instructor') {
                    ({ data, error } = await supabase
                        .from('instructor')
                        .select()
                        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`));
                } else if (type === 'course') {
                    query = supabase
                        .from('v_courses_with_instructors')
                        .select()
                        .or(`course_title.ilike.%${searchQuery}%,subject_code.ilike.%${searchQuery}%`)
                        .gte('academic_year', yearRange[0])
                        .lte('academic_year', yearRange[1])
                        .order('academic_year', { ascending: false })
                        .order('session', { ascending: true })
                        .order('term', { ascending: true })
                        .order('subject_code', { ascending: true });

                    ({ data, error } = await query);
                } else if (type === 'service_role') {
                    ({ data, error } = await supabase
                        .from('service_role')
                        .select()
                        .ilike('title', `%${searchQuery}%`));
                }

                if (error) {
                    console.error("Error fetching data:", error);
                } else {
                    if (type === 'instructor') {
                        data = data.map(instructor => ({
                            id: instructor.instructor_id,
                            name: `${instructor.last_name}, ${instructor.first_name}`,
                            ubc_employee_num: instructor.ubc_employee_num
                        }));
                    } else if (type === 'course') {
                        data = data.map(course => ({
                            id: course.id,
                            name: `${course.subject_code} ${course.course_num} ${course.section_num}`,
                            academic_year: course.academic_year,
                            session: course.session,
                            term: course.term,
                            instructors: course.instructor_names,
                            course_title: course.course_title
                        }));
                    } else if (type === 'service_role') {
                        data = data.map(role => ({
                            id: role.service_role_id,
                            name: role.title,
                            building: role.building,
                            room_num: role.room_num
                        }));
                    }
                    setResults(data);
                }
            })();
        }
    }, [open, searchQuery, type, yearRange]);

    const handleYearChange = (index) => (event) => {
        const newYearRange = [...yearRange];
        newYearRange[index] = event.target.value;
        setYearRange(newYearRange);
    };

    const getColumns = () => {
        if (type === 'instructor') {
            return [
                { field: 'name', headerName: 'Instructor', flex: 1 },
                { field: 'ubc_employee_num', headerName: 'Employee Number', flex: 1 }
            ];
        } else if (type === 'course') {
            return [
                { field: 'name', headerName: 'Course', width: 150 },
                { field: 'academic_year', headerName: 'Year', flex: 1 },
                { field: 'session', headerName: 'Session', flex: 1 },
                { field: 'term', headerName: 'Term', flex: 1 },
                { field: 'instructors', headerName: 'Instructor(s)', flex: 2 },
                { field: 'course_title', headerName: 'Course Title', flex: 2 }
            ];
        } else if (type === 'service_role') {
            return [
                { field: 'name', headerName: 'Service Role', flex: 2 },
                { field: 'building', headerName: 'Building', flex: 1 },
                { field: 'room_num', headerName: 'Room Number', flex: 1 }
            ];
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 1000, // Increased width
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2" mb={2}>
                    Select {type.charAt(0).toUpperCase() + type.slice(1)}
                </Typography>
                {type === 'course' && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <TextField
                            label="From Year"
                            type="number"
                            value={yearRange[0]}
                            onChange={handleYearChange(0)}
                            sx={{ width: '120px' }}
                        />
                        <TextField
                            label="To Year"
                            type="number"
                            value={yearRange[1]}
                            onChange={handleYearChange(1)}
                            sx={{ width: '120px' }}
                        />
                    </Box>
                )}
                {type !== 'course' && (
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                )}
                <DataGrid
                    rows={results}
                    columns={getColumns()}
                    pageSize={5}
                    autoHeight
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
