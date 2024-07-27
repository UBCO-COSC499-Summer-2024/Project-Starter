'use client';
import { csv2json, json2csv } from 'json-2-csv';
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import Navbar from "@/app/components/NavBar";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';

import Link from 'next/link';
import Image from 'next/image';
import { Row } from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState, useEffect, useRef, useCallback } from "react";
import { DataGrid, GridSlots, GridToolbarContainer, GridRowModes, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';

import React from "react";
import { createClient } from '@supabase/supabase-js'
import { Button, styled } from '@mui/material';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);

export default function Home() {
    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 20, editable: false },

        {
            field: 'title',
            headerName: 'Service Role',
            width: 200,
            editable: true,
            renderCell: (params) => (
                <Link href={`/service_roles/service_role_info?title=${params.row.title}&description=${params.row.description}&default_expected_hours=${params.row.default_expected_hours}&building=${params.row.building}&room_num=${params.row.room_num}`} legacyBehavior>
                    {params.value}
                </Link>
            )
        },
        { field: 'description', headerName: 'Description', width: 300, editable: true },
        { field: 'default_expected_hours', headerName: 'Default Monthly Hours', width: 200, editable: true },
        { field: 'assignees', headerName: 'Number of Assignees', width: 200, editable: true }
    ];

    const [serviceRoles, setServiceRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("")
    const [id, setId] = useState('0') 
    const [rowModesModel, setRowModesModel] = React.useState({});
    const handleSaveClick = (id) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {

        // const response = await supabase
        //     .from('service_hours_benchmark')
        //     .delete()
        //     .eq('benchmark_id', id)


        setServiceRoles(serviceRoles.filter((row) => row.id !== id));
        // const result = await supabase.from('service_hours_benchmark').delete().eq('benchmark_id', id).select()
        // console.log(result)

    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    }
    const handleEditClick = (id) => () => {
        console.log(id)
        try {
            if (!serviceRoles.map(row => row.id).includes(id)) {
                alert("Please select a valid row.")
                return
            }
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        }
        catch {

        }
    };
    const EditToolbar = useCallback((props) => {
        console.log(props)
        const { setServiceRoles, setRowModesModel, id } = props;

        const handleClick = () => {
            var id = 1;
            if (setServiceRoles.length >= 1) {
                for (var i = 0; i < setServiceRoles.length; i++) {
                    id = Math.max(id, setServiceRoles[i].id + 1)
                }
            }
            console.log(id)
            setServiceRoles((oldRows) => [...oldRows, { id, name: '', year: '', hours: '' }]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'instructor_name' },

            }));

        };

        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        var buttons = (<>
            <Button
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
            >✏️Edit</Button>
            <Button
                onClick={handleDeleteClick(id)}
                color="inherit"
            >🗑️ Delete</Button></>)

        if (isInEditMode) {
            buttons = (<>
                <Button
                    onClick={handleSaveClick(id)}>
                    💾 Save
                </Button>
                <Button
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit">❌ Cancel</Button>
            </>)

        }


        return (
            <GridToolbarContainer>
                <Button onClick={() => { handleClick() }}>
                    ➕ Add record
                </Button>

                <Button onClick={useCallback(() => {
                    // csv.current.value=(json2csv(setServiceRoles))
                    console.log(setServiceRoles)
                    setDefaultCSV(json2csv(setServiceRoles))
                    setCsvShow(true)
                }, [setServiceRoles])}>
                    📝 Edit As CSV
                </Button>
                {buttons}
            </GridToolbarContainer>
        )
    }, [rowModesModel, serviceRoles]); 


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
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('service_role')
                    .select(`
                        service_role_id,
                        title,
                        description,
                        default_expected_hours,
                        building,
                        room_num,
                        service_role_assign (instructor_id)
                    `);
                if (error) throw error;

                const transformedData = data.map((role) => ({
                    id: role.service_role_id,
                    title: role.title,
                    description: role.description,
                    default_expected_hours: role.default_expected_hours,
                    building: role.building,
                    room_num: role.room_num,
                    assignees: role.service_role_assign.length
                }));

                setServiceRoles(transformedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderTable = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
        if (error) {
            return <p>Error fetching service roles: {error}</p>;
        }
        return (
            <Container>
                <Row className="h-32">
                    <div className="tw-p-3">
                        <DataGrid
                            editMode="row"
                            rows={serviceRoles}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            rowModesModel={rowModesModel}
                            slotProps={{
                                toolbar: { setServiceRoles, setRowModesModel, id },
                            }}
                            checkboxSelection={true}
                            disableMultipleRowSelection={true}
                            onRowSelectionModelChange={(newSelection) => {
                                console.log(newSelection[0])
                                setId(newSelection[0])
                            }}
                            onRowEditStop={(params, event) => {
                                if (params.reason === GridRowEditStopReasons.rowFocusOut) {
                                    event.defaultMuiPrevented = true;
                                }
                            }}
                        />
                    </div>
                </Row>
            </Container>
        );
    };

    return (
        <main>
            <Navbar />
            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h1 style={{ marginRight: "10px" }}>Service Roles</h1>
                <Link href="/service_roles/create_new_service_role" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
                    <Image src="/plus.svg" alt="Add new service roles plus icon" width={20} height={20} style={{ margin: '20px' }} />
                    Create new service role
                </Link>
            </span>
            {renderTable()}
        </main >
    );
}
