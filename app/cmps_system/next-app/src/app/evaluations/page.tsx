'use client'

// Import necessary modules and components
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { csv2json, json2csv } from 'json-2-csv';
import Navbar from "@/app/components/NavBar"
import { Row } from "react-bootstrap";
import { Button, Modal, Typography, Box, styled } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
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
import { DataGrid, GridSlots, GridToolbarContainer, GridRowModes } from '@mui/x-data-grid';
import Link from 'next/link';
import React from "react";
import SearchModal from '@/app/components/SearchModal';

// Register chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Import Supabase client
import supabase from "@/app/components/supabaseClient";

// StyledButton component using MUI's styled utility
const StyledButton = styled(Button)(
    ({ theme }) => `
        color: ${theme.palette.primary.main};
        background-color: ${theme.palette.background.default};
        border: 1px solid ${theme.palette.primary.main};
        padding: 4px 8px;
        font-size: 0.875rem;
        text-transform: none;  // Ensures text is not capitalized
        &:hover {
            background-color: ${theme.palette.primary.light};
        }
    `
);

/**
 * Renders the Evaluations page.
 * 
 * This component displays a table of evaluations and allows users to edit, delete, and add records.
 * It fetches evaluation data from the server using Supabase and updates the data accordingly.
 * Users can also export the data as a CSV file and open modals to select instructors, courses, and service roles.
 * 
 * @returns The Evaluations page component.
 */
export default function Evaluations() {
    // State variables
    const [evaluationData, setEvaluationData] = useState([]); // Holds evaluation data
    const [rowModesModel, setRowModesModel] = useState({}); // Manages row edit modes
    const [csvShow, setCsvShow] = useState(false); // Controls CSV modal visibility
    const [defaultCSV, setDefaultCSV] = useState(""); // Holds default CSV data
    const { push } = useRouter(); // Router for navigation
    const csv = useRef(null); // Ref for CSV text area
    const [selectedRows, setSelectedRows] = useState([]); // Holds selected row IDs
    const [searchModalOpen, setSearchModalOpen] = useState(false); // Controls modal visibility
    const [searchModalType, setSearchModalType] = useState(''); // Holds modal type

    // Fetch evaluation data from Supabase on component mount
    useEffect(() => {
        (async () => {
            try {
                var { data: evalData, error } = await supabase.from("v_evaluations_page").select();
                if (error) throw error;
                setEvaluationData(evalData); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    // Open modal for selecting instructor, course, or service role
    const handleOpenModal = (type, row) => {
        setSearchModalType(type); // Set modal type
        setSearchModalOpen(true); // Open modal
    };

    // Handle selection in modal and update rows accordingly
    const handleSearchModalSelect = (selectedItem) => {
        const updatedRows = evaluationData.map(row => {
            // Update columns of selected rows with item selected in modal
            if (selectedRows.includes(row.id)) {
                let updatedRow = { ...row };
                if (searchModalType === 'instructor' && row.requires_instructor !== false) {
                    updatedRow = { ...updatedRow, instructor_id: selectedItem.id, instructor_full_name: selectedItem.name };
                } else if (searchModalType === 'course' && row.requires_course !== false) {
                    updatedRow = { ...updatedRow, course_id: selectedItem.id, course: selectedItem.name };
                } else if (searchModalType === 'service_role' && row.requires_service_role !== false) {
                    updatedRow = { ...updatedRow, service_role_id: selectedItem.id, service_role: selectedItem.name };
                }
                return updatedRow;
            }
            return row;
        });

        setEvaluationData(updatedRows); // Update state with modified rows
        setSearchModalOpen(false); // Close modal
    };

    // Save changes to the database
    const handleSaveClick = async () => {
        // handleProcessRowUpdate gets called after/alongside this function
        // Update row modes to view mode after saving
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.View };
            });
            return updated;
        });
    };

    const handleProcessRowUpdate = async (row) => {
        // Update state with updated row
        setEvaluationData(evaluationData.map((oldRow) => (oldRow.id === row.id ? row : oldRow)));

        if (selectedRows.includes(row.id)) {
            const { error } = await supabase
                .from('evaluation_entry')
                .update({
                    evaluation_type_id: row.evaluation_type_id,
                    metric_num: row.metric_num,
                    course_id: row.course_id,
                    instructor_id: row.instructor_id,
                    service_role_id: row.service_role_id,
                    evaluation_date: row.evaluation_date,
                    answer: row.answer
                })
                .eq('evaluation_entry_id', row.id);

            if (error) {
                console.error("Error updating record:", error);
            }
        }

        return row;
    };

    // Define table columns with their respective render logic
    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },
        {
            field: 'evaluation_type',
            headerName: 'Evaluation Type',
            width: 200,
            editable: false,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                return isInEditMode ? (
                    <span>{params.row.evaluation_type}</span>
                ) : (
                    <Link href={`/evaluations/evaluation_type_info?id=${params.row.evaluation_type_id}`} passHref>
                        {params.row.evaluation_type}
                    </Link>
                );
            }
        },
        {
            field: 'instructor_full_name',
            headerName: 'Instructor',
            width: 150,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const canEdit = params.row.requires_instructor !== false;
                return isInEditMode && canEdit ? (
                    <StyledButton onClick={() => handleOpenModal('instructor', params.row)}>{params.row.instructor_full_name}</StyledButton>
                ) : (
                    <Link href={`/instructors/instructor_info?id=${params.row.instructor_id}`} passHref>
                        {params.row.instructor_full_name}
                    </Link>
                );
            }
        },
        {
            field: 'course',
            headerName: 'Course',
            width: 150,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const canEdit = params.row.requires_course !== false;
                return isInEditMode && canEdit ? (
                    <StyledButton onClick={() => handleOpenModal('course', params.row)}>{params.row.course}</StyledButton>
                ) : (
                    <Link href={`/courses/course_info?id=${params.row.course_id}`} passHref>
                        {params.row.course}
                    </Link>
                );
            }
        },
        {
            field: 'service_role',
            headerName: 'Service Role',
            width: 200,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const canEdit = params.row.requires_service_role !== false;
                return isInEditMode && canEdit ? (
                    <StyledButton onClick={() => handleOpenModal('service_role', params.row)}>{params.row.service_role}</StyledButton>
                ) : (
                    <Link href={`/service_roles/service_role_info?id=${params.row.service_role_id}`} passHref>
                        {params.row.service_role}
                    </Link>
                );
            }
        },
        { field: 'question_num', headerName: 'Question', width: 100, editable: false },
        { field: 'question', headerName: 'Question Text', width: 300, editable: false },
        { field: 'answer', headerName: 'Answer', width: 150, editable: true },
        { field: 'evaluation_date', headerName: 'Date', width: 200, editable: true }
    ];

    // Custom toolbar for DataGrid
    const EditToolbar = (props) => {
        const isInEditMode = selectedRows.some(id => rowModesModel[id]?.mode === GridRowModes.Edit);

        if (isInEditMode) {
            return (
                <GridToolbarContainer>
                    <Button onClick={handleSaveClick}>💾 Save</Button>
                    <Button className="textPrimary" onClick={handleCancelClick} color="inherit">❌ Cancel</Button>
                </GridToolbarContainer>
            );
        }

        return (
            <GridToolbarContainer>
                <Button color="primary" onClick={() => push("/evaluations/enter_evaluation")}>➕ Add record</Button>
                <Button color="primary" onClick={() => {
                    setDefaultCSV(json2csv(evaluationData)); // Convert JSON to CSV and set it to defaultCSV
                    setCsvShow(true); // Show CSV modal
                }}>📝 Edit As CSV</Button>
                <Button className="textPrimary" onClick={handleEditClick} color="inherit">✏️ Edit</Button>
                <Button onClick={handleDeleteClick} color="inherit">🗑️ Delete</Button>
            </GridToolbarContainer>
        );
    };

    // Handle delete operation
    const handleDeleteClick = async () => {
        if (!confirm("Are you sure you want to delete the selected records?")) return;
        for (const id of selectedRows) {
            const error = (await supabase.from("evaluation_entry").delete().eq("evaluation_entry_id", id)).error;
            if (error) {
                console.error("Error deleting record:", error);
                return;
            }
        }
        setEvaluationData(evaluationData.filter((row) => !selectedRows.includes(row.id))); // Update state after deletion
        setSelectedRows([]); // Clear selected rows
    };

    // Cancel editing
    const handleCancelClick = () => {
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.View, ignoreModifications: true };
            });
            return updated;
        });
    };

    // Set rows to edit mode
    const handleEditClick = () => {
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.Edit };
            });
            return updated;
        });
    };

    // Close CSV modal
    const handleCSVClose = () => setCsvShow(false);

    // Handle cell click for opening modals
    const handleCellClick = (params, event) => {
        if (params.field === 'instructor_full_name' || params.field === 'course' || params.field === 'service_role') {
            const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
            const canEdit = (params.field === 'instructor_full_name' && params.row.requires_instructor !== false) ||
                (params.field === 'course' && params.row.requires_course !== false) ||
                (params.field === 'service_role' && params.row.requires_service_role !== false);

            if (isInEditMode && canEdit) {
                event.stopPropagation(); // Prevent default event handling
                handleOpenModal(params.field.replace('_full_name', ''), params.row); // Open respective modal
            }
        }
    };

    return (
        <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <h1 style={{ marginRight: "10px" }}>Evaluations</h1>

            <Container fluid style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Row style={{ flex: 1 }}>
                    <div style={{ flex: 1, padding: '1rem' }}>
                        <DataGrid
                            editMode="row"
                            rows={evaluationData}
                            columns={tableColumns.map(column => ({
                                ...column,
                                renderCell: (params) => {
                                    if (params.field === 'evaluation_type') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        return isInEditMode ? (
                                            <span>{params.row.evaluation_type}</span>
                                        ) : (
                                            <Link href={`/evaluations/evaluation_type_info?id=${params.row.evaluation_type_id}`} passHref>
                                                {params.row.evaluation_type}
                                            </Link>
                                        );
                                    }
                                    if (params.field === 'instructor_full_name') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        const canEdit = params.row.requires_instructor !== false;
                                        return isInEditMode && canEdit ? (
                                            <StyledButton onClick={() => handleOpenModal('instructor', params.row)}>{params.row.instructor_full_name}</StyledButton>
                                        ) : (
                                            <Link href={`/instructors/instructor_info?id=${params.row.instructor_id}`} passHref>
                                                {params.row.instructor_full_name}
                                            </Link>
                                        );
                                    }
                                    if (params.field === 'course') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        const canEdit = params.row.requires_course !== false;
                                        return isInEditMode && canEdit ? (
                                            <StyledButton onClick={() => handleOpenModal('course', params.row)}>{params.row.course}</StyledButton>
                                        ) : (
                                            <Link href={`/courses/course_info?id=${params.row.course_id}`} passHref>
                                                {params.row.course}
                                            </Link>
                                        );
                                    }
                                    if (params.field === 'service_role') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        const canEdit = params.row.requires_service_role !== false;
                                        return isInEditMode && canEdit ? (
                                            <StyledButton onClick={() => handleOpenModal('service_role', params.row)}>{params.row.service_role}</StyledButton>
                                        ) : (
                                            <Link href={`/service_roles/service_role_info?id=${params.row.service_role_id}`} passHref>
                                                {params.row.service_role}
                                            </Link>
                                        );
                                    }
                                    return <span>{params.value}</span>;
                                }
                            }))}
                            processRowUpdate={handleProcessRowUpdate}
                            pageSizeOptions={[10000]}
                            initialState={{
                                sorting: {
                                    sortModel: [
                                        { field: 'evaluation_date', sort: 'desc' },
                                        { field: 'evaluation_type', sort: 'asc' },
                                        { field: 'instructor_full_name', sort: 'asc' },
                                        { field: 'course', sort: 'asc' },
                                        { field: 'service_role', sort: 'asc' },
                                        { field: 'question_num', sort: 'asc' },
                                    ],
                                },
                            }}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            rowModesModel={rowModesModel}
                            slotProps={{
                                toolbar: { setTimeData: setEvaluationData, setRowModesModel },
                            }}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedRows(newSelection);
                            }}
                            autoHeight
                            onCellClick={handleCellClick}
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
                        setEvaluationData(csv2json(csvText)); // Convert CSV to JSON and update state
                        handleCSVClose(); // Close CSV modal
                    }}>Add</Button>
                </Box>
            </Modal>

            <SearchModal
                open={searchModalOpen}
                handleClose={() => setSearchModalOpen(false)}
                handleSelect={handleSearchModalSelect}
                type={searchModalType}
            />
        </main>
    );
}
