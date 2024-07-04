// this file uses copilot auto compleet in all around areas
'use client'
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { csv2json, json2csv } from 'json-2-csv';
import Navbar from "@/app/components/NavBar"
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link';
import Image from 'next/image';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormControl, FormGroup, FormLabel, NavDropdown, NavLink, NavbarCollapse, NavbarText, Row, Table } from "react-bootstrap";
import { Button, Modal, Typography, Box, styled } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState, useEffect, useRef } from "react";
import { DataGrid, GridSlots, GridToolbarContainer } from '@mui/x-data-grid';
import React from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Home() {
    useEffect(() => {
        (async () => {
            // console.log(process.env.ANON_KEY)
            try
            // !Change this link to your own supabase link! https://legendary-memory-6q7wp999jvqfxxp4-8000.app.github.dev
            {const supabase = createClient("https://legendary-memory-6q7wp999jvqfxxp4-8000.app.github.dev", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE");
                const { data, error } = await supabase.from("v_course").select();
                if (error) throw error;
                console.log(data)
                setCourseData(data)
            }
            
            catch(error)
            {console.error("Error fetching data:", error)

            }
        })()
    }, [])

    const tableColumns = [
        { field: 'course_title', headerName: 'Course', width: 100, editable: true },
        { field: 'location', headerName: 'Location', width: 200, editable: true },
        { field: 'instructor_name', headerName: 'Instructor', width: 200, editable: true },
        { field: 'num_students', headerName: 'Number of Students', width: 200, editable: true },
        { field: 'num_TAs', headerName: 'Number of TAs', width: 200, editable: true },
        { field: 'average_grade', headerName: 'Average Grade', width: 200, editable: true },
        { field: 'year_level', headerName: 'Year Level', width: 200, editable: true },
        { field: 'session', headerName: 'Session', width: 200, editable: true },
    ]

    const [courseData, setCourseData] = useState([
    ]);
    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("")
    const EditToolbar = () => {
        return (
            <GridToolbarContainer>
                <Button color="primary" onClick={() => { push("/courses/create_new_course") }}>
                    ➕ Add record
                </Button>

                <Button color="primary" onClick={() => {
                    // csv.current.value=(json2csv(courseData))
                    setDefaultCSV(json2csv(courseData))
                    setCsvShow(true)
                }}>
                    ✏️ Edit As CSV
                </Button>
            </GridToolbarContainer>
        )
    }

    const [csvShow, setCsvShow] = useState(false)
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
      
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `,
      );
    const csv = useRef(null);
    return (
        <main>


            <Navbar />

            <Container>
                <Row className="h-32">
                    <div className="tw-p-3">
                        <DataGrid
                            editMode="row"
                            rows={courseData}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                        />
                    </div>
                </Row>
            </Container>

            <Modal open={csvShow} onClose={handleCSVClose}>
                <Box sx={{
                    position: 'absolute' as 'absolute',
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
                    setCourseData(csv2json(csvText))
                    handleCSVClose()
                }}

                >Add</Button>
            </Box>
        </Modal>
        </main >
    );
}