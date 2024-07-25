'use client'
import { useEffect, useRef, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { csv2json, json2csv } from 'json-2-csv';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Modal, Typography, Box, styled } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { Row } from "react-bootstrap";
import { DataGrid, GridSlots, GridToolbarContainer } from '@mui/x-data-grid';
import React from "react";
import Navbar from "@/app/components/NavBar";
import Container from 'react-bootstrap/Container';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Home() {
    const [courseData, setCourseData] = useState([]);
    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("");
    const [csvShow, setCsvShow] = useState(false);
    const csv = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
                const { data, error } = await supabase.from("v_courses_with_instructors").select();
                if (error) throw error;
                console.log(data);
                setCourseData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    const handleSectionClick = (id, event) => {
        event.preventDefault();
        push(`/courses/course_info?id=${id}`);
    };

    const renderSectionNumber = (params) => {
        return (
            <a
                href={`/courses/course_info?id=${params.row.id}`}
                onClick={(event) => handleSectionClick(params.row.id, event)}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
                {params.value}
            </a>
        );
    };

    const renderInstructorNames = (params) => {
        const names = params.row.instructor_names.split(', ');
        const ids = params.row.instructor_ids.split(', ');
        return (
            <div>
                {names.map((name, index) => (
                    <React.Fragment key={ids[index]}>
                        <a href={`/instructors/instructor_info?id=${ids[index]}`}>{name}</a>
                        {index < names.length - 1 && <span>, </span>}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const tableColumns = [
        { field: 'subject_code', headerName: 'Subject', flex: 1, editable: true },
        { field: 'course_num', headerName: 'Course No.', flex: 1, editable: true },
        {
            field: 'section_num',
            headerName: 'Section',
            flex: 1,
            editable: true,
            renderCell: renderSectionNumber
        },
        { field: 'course_title', headerName: 'Course Title', flex: 2, editable: true },
        { field: 'academic_year', headerName: 'Academic Year', flex: 1, editable: true },
        { field: 'session', headerName: 'Session', flex: 1, editable: true },
        { field: 'term', headerName: 'Term', flex: 1, editable: true },
        {
            field: 'instructor_names',
            headerName: 'Instructors',
            flex: 2,
            editable: true,
            renderCell: renderInstructorNames
        },
        { field: 'num_students', headerName: 'Students', flex: 1, editable: true },
        { field: 'num_tas', headerName: 'TAs', flex: 1, editable: true },
        { field: 'average_grade', headerName: 'Avg. Grade', flex: 1, editable: true },
        { field: 'location', headerName: 'Location', flex: 1, editable: true },
    ];

    const EditToolbar = () => {
        return (
            <GridToolbarContainer>
                <Button color="primary" onClick={() => { push("/courses/create_new_course") }}>
                    ➕ Add record
                </Button>

                <Button color="primary" onClick={() => {
                    setDefaultCSV(json2csv(courseData));
                    setCsvShow(true);
                }}>
                    ✏️ Edit As CSV
                </Button>
            </GridToolbarContainer>
        );
    };

    const handleCSVClose = () => setCsvShow(false);

    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
    };

    const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
    };

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
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
        &:hover {
          border-color: ${blue[400]};
        }
        &:focus {
          border-color: ${blue[400]};
          box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
        }
        &:focus-visible {
          outline: 0;
        }
      `,
    );

    return (
        <main>
            <Navbar />
            <h1 style={{ marginRight: "10px" }}>Courses</h1>

            <Container fluid style={{ maxWidth: '100%' }}>
                <Row className="h-32">
                    <div style={{ width: '100%', padding: '1rem' }}>
                        <DataGrid
                            editMode="row"
                            rows={courseData}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            autoHeight
                        />
                    </div>
                </Row>
            </Container>

            <Modal open={csvShow} onClose={handleCSVClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "80%",
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Batch Editing
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextareaAutosize defaultValue={defaultCSV} ref={csv}></TextareaAutosize>
                    </Typography>

                    <Button className="!tw-m-2" variant="outlined" onClick={handleCSVClose}>Discard</Button>
                    <Button className="!tw-m-2" variant="contained" onClick={() => {
                        const csvText = csv.current.value;
                        setCourseData(csv2json(csvText));
                        handleCSVClose();
                    }}>
                        Add
                    </Button>
                </Box>
            </Modal>
        </main>
    );
}
