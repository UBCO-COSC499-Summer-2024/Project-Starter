import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DataGrid, GridSlots, GridToolbarContainer, GridRowModes } from '@mui/x-data-grid';
import { Button, Modal, Typography, Box, styled, TextField } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import Link from 'next/link';
import { csv2json, json2csv } from 'json-2-csv';
import { useRouter } from 'next/navigation';
import supabase from '@/app/components/supabaseClient';
import SearchModal from '@/app/components/SearchModal';

const StyledButton = styled(Button)(
    ({ theme }) => `
    color: ${theme.palette.primary.main};
    background-color: ${theme.palette.background.default};
    border: 1px solid ${theme.palette.primary.main};
    padding: 4px 8px;
    font-size: 0.875rem;
    text-transform: none;
    &:hover {
        background-color: ${theme.palette.primary.light};
    }
  `
);

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
    color: ${theme.palette.mode === 'dark' ? '#DAE2ED' : '#303740'};
    background: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? '#6B7A90' : '#DAE2ED'};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? '#1C2025' : '#F3F6F9'};
    &:hover {
      border-color: '#3399FF';
    }
    &:focus {
      border-color: '#3399FF';
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? '#0072E5' : '#b6daff'};
    }
    &:focus-visible {
      outline: 0;
    }
  `,
);

const processColumnConfig = (columnsConfig, rowModesModel, handleOpenModal) => {
    return columnsConfig.map(column => ({
        ...column,
        renderCell: (params) => {
            const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
            const canEdit = column.editConfig?.canEdit !== false;

            if (isInEditMode && canEdit) {
                if (column.editConfig?.type === 'searchModal') {
                    return (
                        <StyledButton onClick={() => handleOpenModal(column.editConfig.modalType, params.row)}>
                            {params.value}
                        </StyledButton>
                    );
                }
                return <TextField
                    value={params.value}
                    onChange={(event) => params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value })}
                    size="small"
                />;
            }

            if (column.linkConfig) {
                return (
                    <Link href={`${column.linkConfig.prefix}${params.row[column.linkConfig.idField]}`} passHref>
                        {params.value}
                    </Link>
                );
            }

            return <span>{params.value}</span>;
        }
    }));
};

export default function CMPS_Table({ fetchUrl, columnsConfig, initialSortModel, tableName, rowUpdateHandler, deleteWarningMessage, idColumn, newRecordURL }) {
    const router = useRouter();
    const [tableData, setTableData] = useState([]);
    const [initialTableData, setInitialTableData] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [csvShow, setCsvShow] = useState(false);
    const [defaultCSV, setDefaultCSV] = useState("");
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchModalType, setSearchModalType] = useState('');
    const csv = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase.from(fetchUrl).select();
                if (error) throw error;
                setTableData(data);
                setInitialTableData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, [fetchUrl]);

    const handleOpenModal = (type, row) => {
        setSearchModalType(type);
        setSearchModalOpen(true);
    };

    const handleSearchModalSelect = (selectedItem) => {
        const updatedRows = tableData.map(row => {
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

        setTableData(updatedRows);
        setSearchModalOpen(false);
    };

    const handleSaveClick = async () => {
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.View };
            });
            return updated;
        });
    };

    const handleProcessRowUpdate = async (row) => {
        setTableData(tableData.map((oldRow) => (oldRow.id === row.id ? row : oldRow)));
        if (selectedRows.includes(row.id)) {
            await rowUpdateHandler(row);
        }
        return row;
    };

    const handleCancelClick = () => {
        setTableData(initialTableData);
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.View, ignoreModifications: true };
            });
            return updated;
        });
    };

    const handleEditClick = () => {
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.Edit };
            });
            return updated;
        });
    };

    const handleDeleteClick = async () => {
        if (!confirm(deleteWarningMessage || "Are you sure you want to delete the selected records? This action is not recoverable!")) return;
        for (const id of selectedRows) {
            const { error } = await supabase.from(tableName).delete().eq(idColumn || "id", id);
            if (error) {
                console.error("Error deleting record:", error);
                return;
            }
        }
        setTableData(tableData.filter((row) => !selectedRows.includes(row.id)));
        setSelectedRows([]);
    };

    const handleCellClick = (params, event) => {
        const columnConfig = columnsConfig.find(column => column.field === params.field);
        if (columnConfig && columnConfig.editConfig?.type === 'searchModal') {
            const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
            const canEdit = columnConfig.editConfig?.canEdit !== false;
            if (isInEditMode && canEdit) {
                event.stopPropagation();
                handleOpenModal(columnConfig.editConfig.modalType, params.row);
            }
        }
    };

    const handleEditAsCSV = async () => {
        const { data, error } = await supabase.from(tableName).select();
        if (error) {
            console.error("Error fetching data for CSV:", error);
            return;
        }
        const csvData = await json2csv(data);
        setDefaultCSV(csvData);
        setCsvShow(true);
    };

    const handleApplyCSV = async () => {
        try {
            const csvText = csv.current.value;
            const jsonData = await csv2json(csvText);

            for (const row of jsonData) {
                if (!row[idColumn]) {
                    delete row[idColumn];
                    const { error } = await supabase.from(tableName).insert(row);
                    if (error) {
                        console.error("Error inserting row:", error);
                        return;
                    }
                } else {
                    const { error } = await supabase.from(tableName).upsert(row);
                    if (error) {
                        console.error("Error updating row:", error);
                        return;
                    }
                }
            }

            const { data, error } = await supabase.from(fetchUrl).select();
            if (error) throw error;
            setTableData(data);
            setCsvShow(false);
        } catch (error) {
            console.error("Error processing CSV data:", error);
        }
    };

    const handleAddRecordClick = () => {
        if (newRecordURL) {
            router.push(newRecordURL);
        } else {
            const newId = Math.max(...tableData.map(row => row.id)) + 1;
            const newRow = { id: newId, isNew: true };
            setTableData([newRow, ...tableData]);
            setRowModesModel(prev => ({
                ...prev,
                [newId]: { mode: GridRowModes.Edit }
            }));
            setSelectedRows([newId]);
        }
    };

    const EditToolbar = () => {
        const isInEditMode = selectedRows.some(id => rowModesModel[id]?.mode === GridRowModes.Edit);

        return (
            <GridToolbarContainer>
                {isInEditMode ? (
                    <>
                        <Button onClick={handleSaveClick}>💾 Save</Button>
                        <Button className="textPrimary" onClick={handleCancelClick} color="inherit">❌ Cancel</Button>
                    </>
                ) : (
                    <>
                        <Button color="primary" onClick={handleAddRecordClick}>➕ Add Record</Button>
                        <Button color="primary" onClick={handleEditAsCSV}>📝 Edit As CSV</Button>
                        <Button className="textPrimary" onClick={handleEditClick} color="inherit">✏️ Edit</Button>
                        <Button onClick={handleDeleteClick} color="inherit">🗑️ Delete</Button>
                    </>
                )}
            </GridToolbarContainer>
        );
    };

    const handleCSVClose = () => setCsvShow(false);

    const processedColumns = processColumnConfig(columnsConfig, rowModesModel, handleOpenModal);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, padding: '1rem' }}>
                <DataGrid
                    editMode="row"
                    rows={tableData}
                    columns={processedColumns}
                    processRowUpdate={handleProcessRowUpdate}
                    pageSizeOptions={[10000]}
                    initialState={{ sorting: { sortModel: initialSortModel } }}
                    slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                    rowModesModel={rowModesModel}
                    slotProps={{ toolbar: { setTableData, setRowModesModel } }}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
                    autoHeight
                    onCellClick={handleCellClick}
                />
            </div>

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
                        <TextField
                            multiline
                            rows={20}
                            fullWidth
                            defaultValue={defaultCSV}
                            inputRef={csv}
                        />
                    </Typography>
                    <Button variant="outlined" onClick={handleCSVClose}>Discard</Button>
                    <Button variant="contained" onClick={handleApplyCSV}>Apply</Button>
                </Box>
            </Modal>

            <SearchModal
                open={searchModalOpen}
                handleClose={() => setSearchModalOpen(false)}
                handleSelect={handleSearchModalSelect}
                type={searchModalType}
            />
        </div>
    );
}
