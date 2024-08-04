import React, { useEffect, useState, useRef } from 'react';
import { DataGrid, GridToolbarContainer, GridRowModes } from '@mui/x-data-grid';
import { Button, Modal, Typography, Box, styled, TextField, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import Link from 'next/link';
import { csv2json, json2csv } from 'json-2-csv';
import { useRouter } from 'next/navigation';
import supabase from '@/app/components/supabaseClient';
import SearchModal from '@/app/components/SearchModal';
import { saveAs } from 'file-saver';

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
            const canEdit = column.editable !== false && column.editConfig?.canEdit !== false;

            if (isInEditMode && canEdit) {
                if (column.editConfig?.type === 'searchModal') {
                    return (
                        <StyledButton onClick={() => handleOpenModal(column.editConfig.modalType, params.row)}>
                            {params.value}
                        </StyledButton>
                    );
                }
                if (column.type === 'boolean') {
                    return (
                        <Checkbox
                            checked={!!params.value}
                            onChange={(event) => params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.checked })}
                        />
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

            if (column.type === 'boolean') {
                return (
                    <Checkbox
                        checked={!!params.value}
                        disabled
                    />
                );
            }

            return <span>{params.value !== undefined && params.value !== null ? params.value.toString() : 'N/A'}</span>;
        }
    }));
};

interface CMPS_TableProps {
    fetchUrl: string;
    columnsConfig: any[];
    initialSortModel: any[];
    tableName: string;
    rowUpdateHandler: (row: any) => Promise<any>;
    deleteWarningMessage: string;
    idColumn: string;
    uniqueColumns?: string[];
    newRecordURL?: string;
    showSelectAll?: boolean;
}

const fetchTableData = async (fetchUrl, setDataCallback) => {
    try {
        const { data, error } = await supabase.from(fetchUrl).select();
        if (error) throw error;
        setDataCallback(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const fetchTableColumns = async (tableName, setColumnNames) => {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
        if (error) throw error;
        if (data.length > 0) {
            setColumnNames(Object.keys(data[0]));
        }
    } catch (error) {
        console.error("Error fetching table columns:", error);
    }
};

const getUserRole = async (setUserRoleCallback) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        const { data, error } = await supabase
            .from('user_role')
            .select('role')
            .eq('user_id', user.id)
            .single();
        if (error) throw error;
        setUserRoleCallback(data.role);
    } catch (error) {
        console.error("Error fetching user role:", error);
    }
};

const handleUpsertRows = async (rows, tableName, uniqueColumns, idColumn) => {
    const onConflictColumns = uniqueColumns && uniqueColumns.length > 0 ? uniqueColumns : [idColumn];

    const { data: existingRows, error: fetchError } = await supabase.from(tableName).select(`${idColumn}, ${uniqueColumns.join(', ')}`);
    if (fetchError) {
        console.error("Error fetching existing rows:", fetchError);
        return fetchError.message;
    }

    const existingRowsMap = new Map(existingRows.map(row => [row[idColumn], row]));

    const unmodifiedUnique = [];
    const modifiedUnique = [];
    const rowsWithEmptyId = [];

    rows.forEach(row => {
        Object.keys(row).forEach(key => {
            if (row[key] === "" && typeof row[key] === 'string') {
                row[key] = null;
            }
        });

        if (!row[idColumn]) {
            delete row[idColumn];
            rowsWithEmptyId.push(row);
        } else {
            const existingRow = existingRowsMap.get(row[idColumn]);
            if (existingRow) {
                const uniqueColumnsModified = uniqueColumns.some(col => row[col] !== existingRow[col]);
                if (uniqueColumnsModified) {
                    modifiedUnique.push(row);
                } else {
                    unmodifiedUnique.push(row);
                }
            } else {
                unmodifiedUnique.push(row);
            }
        }
    });

    let upsertError = null;

    // Upsert rows whose unique columns have been modified
    if (modifiedUnique.length > 0) {
        const { error } = await supabase.from(tableName).upsert(modifiedUnique, { onConflict: idColumn });
        if (error) {
            console.error("Error upserting row with modified unique columns:", error);
            upsertError = error;
        }
    }

    // Upsert rows whose unique columns have not been modified
    if (unmodifiedUnique.length > 0) {
        const { error } = await supabase.from(tableName).upsert(unmodifiedUnique, { onConflict: onConflictColumns });
        if (error) {
            console.error("Error upserting row with unmodified unique columns:", error);
            upsertError = error;
        }
    }

    // Insert rows with empty idColumn. This had to be done separately because
    // supabase's .upsert() can't handle doing it at the same time
    // as rows that do have an idColumn
    if (rowsWithEmptyId.length > 0) {
        const { error } = await supabase.from(tableName).upsert(rowsWithEmptyId, { onConflict: onConflictColumns });
        if (error) {
            console.error("Error inserting rows with empty idColumn:", error);
            upsertError = error;
        }
    }

    return upsertError;
};

const detectDuplicates = async (rows, idColumn, uniqueColumns) => {
    const idSet = new Map();
    const uniqueSet = new Map();
    const duplicatePKs = [];
    const duplicateUnique = [];

    rows.forEach(row => {
        if (row[idColumn]) {
            if (idSet.has(row[idColumn])) {
                duplicatePKs.push(row, idSet.get(row[idColumn]));
            } else {
                idSet.set(row[idColumn], row);
            }
        }

        const uniqueColumnsString = uniqueColumns.map(col => `${col}=${row[col]}`).join('|');
        if (uniqueColumnsString) {
            if (uniqueSet.has(uniqueColumnsString)) {
                duplicateUnique.push(row, uniqueSet.get(uniqueColumnsString));
            } else {
                uniqueSet.set(uniqueColumnsString, row);
            }
        }
    });

    return { duplicatePKs, duplicateUnique };
};

const detectUniqueCollisions = (existingData, importedData, idColumn: string, uniqueColumns: string[]) => {
    const getUniqueKey = (row) => uniqueColumns.map(col => `${col}=${row[col]}`).join('|');

    const existingUniqueKeyMap = new Map(existingData.map(row => [getUniqueKey(row), row]));
    const collisionRows = [];

    importedData.forEach(row => {
        if (row[idColumn]) {
            const uniqueKey = getUniqueKey(row);
            const existingUniqueRow = existingUniqueKeyMap.get(uniqueKey);
            // If we are updating a row's unique key to one that already exists IN ANOTHER ROW, that is a collision.
            if (existingUniqueRow && existingUniqueRow[idColumn] !== row[idColumn]) {
                collisionRows.push({
                    importedRow: row,
                    existingRow: existingUniqueRow,
                });
            }
        }
    });

    return collisionRows;
};

const handleDeleteRows = async (deletedIds, tableName, idColumn) => {
    if (deletedIds.length > 0) {
        const { error } = await supabase.from(tableName).delete().in(idColumn, deletedIds);
        if (error) {
            console.error("Error deleting rows:", error);
            return error.message;
        }
    }

    return null;
};

const formatRowData = (row) => {
    return JSON.stringify(row, null, 2);
};

const CMPS_Table: React.FC<CMPS_TableProps> = ({
    fetchUrl,
    columnsConfig,
    initialSortModel,
    tableName,
    rowUpdateHandler,
    deleteWarningMessage,
    idColumn,
    uniqueColumns,
    newRecordURL,
    showSelectAll = false
}) => {
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
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [tableColumns, setTableColumns] = useState([]);

    const [beforeData, setBeforeData] = useState([]);
    const [afterData, setAfterData] = useState([]);
    const [addedRows, setAddedRows] = useState([]);
    const [deletedRows, setDeletedRows] = useState([]);
    const [modifiedRows, setModifiedRows] = useState([]);
    const [modifiedCells, setModifiedCells] = useState({});
    const [duplicatePKRows, setDuplicatePKRows] = useState([]);
    const [duplicateUniqueRows, setDuplicateUniqueRows] = useState([]);
    const [showBeforeAfterModal, setShowBeforeAfterModal] = useState(false);
    const [uniqueCollisionRows, setUniqueCollisionRows] = useState([]);

    useEffect(() => {
        fetchTableData(fetchUrl, setTableData);
        fetchTableData(fetchUrl, setInitialTableData);
        fetchTableColumns(tableName, setTableColumns);
    }, [fetchUrl, tableName]);

    useEffect(() => {
        getUserRole(setUserRole);
    }, []);

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
            const { error } = await rowUpdateHandler(row);
            if (error) {
                setErrorMessages(prev => [...prev, { message: error.message.charAt(0).toUpperCase() + error.message.slice(1) || 'An error occurred', row }]);
                setErrorOpen(true);
            }
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

        try {
            const deletedIds = selectedRows;
            const deleteError = await handleDeleteRows(deletedIds, tableName, idColumn);
            if (deleteError) {
                setErrorMessages([deleteError]);
                setErrorOpen(true);
                return;
            }

            await fetchTableData(fetchUrl, setTableData);
            setSelectedRows([]);
        } catch (error) {
            console.error("Error during deletion:", error);
            setErrorMessages([error]);
            setErrorOpen(true);
        }
    };

    const handleCellClick = (params, event) => {
        const columnConfig = columnsConfig.find(column => column.field === params.field);
        if (columnConfig && columnConfig.editConfig?.type === 'searchModal') {
            const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
            const canEdit = columnConfig.editable !== false && columnConfig.editConfig?.canEdit !== false;
            if (isInEditMode && canEdit) {
                event.stopPropagation();
                handleOpenModal(columnConfig.editConfig.modalType, params.row);
            }
        }
    };

    const handleCSVEdit = async () => {
        const { data, error } = await supabase.from(tableName).select();
        if (error) {
            console.error("Error fetching data for CSV:", error);
            return;
        }
        const csvData = await json2csv(data, { delimiter: { wrap: '"' } });
        setDefaultCSV(csvData);
        setCsvShow(true);
    };

    // Returns true if the two JSON objects are equal, with the exception that numeric strings are considered equal to numbers
    const compareJsonWithCasting = (obj1: any, obj2: any): boolean => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            const val1 = obj1[key];
            const val2 = obj2[key];

            // Convert numeric strings to numbers for comparison
            if (typeof val1 === 'string' && !isNaN(Number(val1)) && typeof val2 === 'number') {
                if (Number(val1) !== val2) {
                    return false;
                }
            } else if (typeof val1 === 'number' && typeof val2 === 'string' && !isNaN(Number(val2))) {
                if (val1 !== Number(val2)) {
                    return false;
                }
            } else if (val1 !== val2) {
                return false;
            }
        }

        return true;
    };

    const calculateDifferences = async (originalData, updatedData, isImportMode = false) => {
        const originalMap = new Map(originalData.map(row => [row[idColumn], row]));
        const updatedMap = new Map(updatedData.map(row => [row[idColumn], row]));

        const added = updatedData.filter(row => !originalMap.has(row[idColumn]));
        const deleted = isImportMode ? [] : originalData.filter(row => !updatedMap.has(row[idColumn]));
        const modified = updatedData.filter(row => {
            const originalRow = originalMap.get(row[idColumn]);
            return originalRow && !compareJsonWithCasting(originalRow, row);
        });

        const modifiedCells = {};
        updatedData.forEach(row => {
            const originalRow = originalMap.get(row[idColumn]);
            if (originalRow) {
                Object.keys(row).forEach(col => {
                    if (String(row[col]) !== String(originalRow[col])) {
                        if (!modifiedCells[row[idColumn]]) {
                            modifiedCells[row[idColumn]] = {};
                        }
                        modifiedCells[row[idColumn]][col] = true;
                    }
                });
            }
        });

        const duplicates = await detectDuplicates(updatedData, idColumn, uniqueColumns);
        const uniqueDuplicateRows = new Set([...duplicates.duplicatePKs, ...duplicates.duplicateUnique].map(row => row[idColumn]));

        setAddedRows(added.filter(row => !uniqueDuplicateRows.has(row[idColumn])));
        setDeletedRows(deleted.filter(row => !uniqueDuplicateRows.has(row[idColumn])));
        setModifiedRows(modified.filter(row => !uniqueDuplicateRows.has(row[idColumn])));
        setModifiedCells(modifiedCells);
        setDuplicatePKRows(duplicates.duplicatePKs);
        setDuplicateUniqueRows(duplicates.duplicateUnique);
        setUniqueCollisionRows(isImportMode ? detectUniqueCollisions(originalData, updatedData, idColumn, uniqueColumns) : []);
    };

    const handleShowBeforeAfter = async (originalData, updatedData, isImport = false) => {
        setBeforeData(originalData);
        setAfterData(updatedData);
        await calculateDifferences(originalData, updatedData, isImport);
        setShowBeforeAfterModal(true);
    };

    const handleApplyCSV = async () => {
        try {
            const csvText = csv.current.value;
            const jsonData = await csv2json(csvText, { delimiter: { wrap: '"' } });
            const originalData = await csv2json(defaultCSV, { delimiter: { wrap: '"' } });

            await handleShowBeforeAfter(originalData, jsonData);
        } catch (error) {
            console.error("Error processing CSV data:", error);
            setErrorMessages([error]);
            setErrorOpen(true);
        }
    };

    const handleConfirmChanges = async () => {
        try {
            const jsonData = afterData;

            const originalIds = new Set(beforeData.map(row => row[idColumn]));
            const currentIds = new Set(jsonData.map(row => row[idColumn]));
            const deletedIds = [...originalIds].filter(id => !currentIds.has(id));

            // Check for deleted rows
            if (deletedIds.length > 0) {
                if (!confirm(deleteWarningMessage || "Are you sure you want to delete the selected records? This action is not recoverable!")) return;
            }

            const deleteError = await handleDeleteRows(deletedIds, tableName, idColumn);
            if (deleteError) {
                setErrorMessages([deleteError]);
                setErrorOpen(true);
                return;
            }

            const upsertError = await handleUpsertRows(jsonData, tableName, uniqueColumns, idColumn);
            if (upsertError) {
                console.error("Error upserting rows:", upsertError);
                setErrorMessages([upsertError]);
                setErrorOpen(true);
                return;
            }

            await fetchTableData(fetchUrl, setTableData);
            setCsvShow(false);
            setShowBeforeAfterModal(false);
        } catch (error) {
            console.error("Error confirming changes:", error);
            setErrorMessages([error]);
            setErrorOpen(true);
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

    const handleCSVImport = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvText = e.target.result;
                try {
                    const cleanCsvText = (csvText as string).split('\n').map(line => line.split(',').map(cell => cell.trim()).join(',')).join('\n');
                    const importedData = await csv2json(cleanCsvText, { trimHeaderFields: false, trimFieldValues: false });
                    const { data, error } = await supabase.from(tableName).select();
                    const originalData = data;
                    if (error) {
                        console.error("Error fetching data for CSV:", error);
                        return;
                    }

                    await handleShowBeforeAfter(originalData, importedData, true);
                } catch (error) {
                    console.error("Error processing CSV file:", error);
                    setErrorMessages([error]);
                    setErrorOpen(true);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const { data, error } = await supabase.from(tableName).select();
            if (error) {
                console.error("Error fetching data for CSV download:", error);
                setErrorMessages([error]);
                setErrorOpen(true);
                return;
            }
            const csvData = await json2csv(data, { delimiter: { wrap: '"' } });
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${tableName}.csv`);
        } catch (error) {
            console.error("Error downloading CSV:", error);
            setErrorMessages([error]);
            setErrorOpen(true);
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
                        <Button color="primary" onClick={handleCSVEdit}>📝 Edit As CSV</Button>
                        <Button className="textPrimary" onClick={handleEditClick} color="inherit">✏️ Edit</Button>
                        <Button onClick={handleDeleteClick} color="inherit">🗑️ Delete</Button>
                        <input
                            accept=".csv"
                            style={{ display: 'none' }}
                            id="upload-csv-file"
                            type="file"
                            onChange={handleCSVImport}
                        />
                        <label htmlFor="upload-csv-file">
                            <Button component="span" color="primary">📤 Upload CSV</Button>
                        </label>
                        <Button color="primary" onClick={handleDownloadCSV}>📥 Download CSV</Button>
                    </>
                )}
            </GridToolbarContainer>
        );
    };

    const handleCSVClose = () => setCsvShow(false);

    const handleCloseErrorModal = () => {
        setErrorOpen(false);
        setErrorMessages([]);
    };

    const handleBeforeAfterClose = () => {
        setShowBeforeAfterModal(false);
        setBeforeData([]);
        setAfterData([]);
        setAddedRows([]);
        setDeletedRows([]);
        setModifiedRows([]);
        setModifiedCells({});
        setDuplicatePKRows([]);
        setDuplicateUniqueRows([]);
        setUniqueCollisionRows([]);
    };

    const renderDifferencesTable = (rows, color, highlightCells = {}, highlightColumns = {}, isCollisionTable = false) => {
        if (!rows || !rows.length) {
            return null;
        }

        const columnsToRender = isCollisionTable ? ["Type", ...tableColumns] : tableColumns;

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        {columnsToRender.map((column) => (
                            <TableCell key={column}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => row && (
                        <TableRow key={index} style={{ backgroundColor: color }}>
                            {columnsToRender.map((column) => (
                                <TableCell
                                    key={column}
                                    style={
                                        (highlightCells[row[idColumn]] && highlightCells[row[idColumn]][column])
                                            ? { backgroundColor: '#ffd960' }
                                            : (highlightColumns[column] && row[column])
                                                ? { backgroundColor: highlightColumns[column] }
                                                : {}
                                    }
                                >
                                    {column === 'Type' ? (row.type === 'imported' ? 'Imported' : 'Existing') : (row[column] !== undefined && row[column] !== null ? row[column].toString() : 'N/A')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const processedColumns = processColumnConfig(columnsConfig, rowModesModel, handleOpenModal);

    const hasDuplicates = duplicatePKRows.length > 0 || duplicateUniqueRows.length > 0;
    const hasCollisions = uniqueCollisionRows.length > 0;

    const hasUniqueCollisions = uniqueCollisionRows.length > 0;

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
                    slots={{ toolbar: userRole === 'head' || userRole === 'staff' ? EditToolbar : null }}
                    rowModesModel={rowModesModel}
                    slotProps={{ toolbar: { setTableData, setRowModesModel } }}
                    checkboxSelection={userRole === 'head' || userRole === 'staff'}
                    onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
                    autoHeight
                    onCellClick={handleCellClick}
                    sx={{
                        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                            display: showSelectAll ? "flex" : "none"
                        }
                    }}
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
                    {uniqueColumns && uniqueColumns.length > 0 && (
                        <Typography id="modal-unique-keys" sx={{ mt: 1, mb: 1 }}>
                            Unique Key Constraint: {uniqueColumns.join(', ')}.
                        </Typography>
                    )}
                    {(
                        <Typography id="modal-primary-key" sx={{ mt: 1, mb: 1 }}>
                            Primary  Key Constraint: {idColumn}.
                        </Typography>
                    )}
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField
                            multiline
                            rows={20}
                            fullWidth
                            defaultValue={defaultCSV}
                            inputRef={csv}
                        />
                    </Typography>
                    <Button variant="outlined" onClick={handleCSVClose} sx={{ m: 1 }}>Discard</Button>
                    <Button variant="contained" onClick={handleApplyCSV} sx={{ m: 1 }}>Apply</Button>
                </Box>
            </Modal>

            <SearchModal
                open={searchModalOpen}
                handleClose={() => setSearchModalOpen(false)}
                handleSelect={handleSearchModalSelect}
                type={searchModalType}
            />

            <Dialog open={errorOpen} onClose={handleCloseErrorModal} maxWidth="md" fullWidth>
                <DialogTitle>Error</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                        {errorMessages.map((error, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <DialogContentText>{error.message}</DialogContentText>
                                <Box component="pre" sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                    {formatRowData(error.row)}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showBeforeAfterModal} onClose={handleBeforeAfterClose} maxWidth="xl" fullWidth>
                <DialogTitle>Changes Preview</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                        {duplicatePKRows.length > 0 && (
                            <>
                                <Typography variant="h6">Duplicate Rows Provided (Primary Key):</Typography>
                                {renderDifferencesTable(duplicatePKRows, '#E6E6FA', {}, { [idColumn]: '#ffb3b3' })}
                            </>
                        )}
                        {duplicateUniqueRows.length > 0 && (
                            <>
                                <Typography variant="h6">Duplicate Rows Provided (Unique Key):</Typography>
                                {renderDifferencesTable(duplicateUniqueRows, '#E6E6FA', {}, Object.fromEntries(uniqueColumns.map(col => [col, '#ffb3b3'])))}
                            </>
                        )}
                        {hasUniqueCollisions && (
                            <>
                                <Typography variant="h6">Unique Key Collisions:</Typography>
                                {renderDifferencesTable(uniqueCollisionRows.map(collision => ({
                                    ...collision.importedRow,
                                    type: 'imported'
                                })), '#E6E6FA', {}, Object.fromEntries(uniqueColumns.map(col => [col, '#ffb3b3'])), true)}
                                {renderDifferencesTable(uniqueCollisionRows.map(collision => ({
                                    ...collision.existingRow,
                                    type: 'existing'
                                })), '#E6E6FA', {}, Object.fromEntries(uniqueColumns.map(col => [col, '#ffb3b3'])), true)}
                            </>
                        )}
                        {addedRows.length > 0 && (
                            <>
                                <Typography variant="h6">Added Rows:</Typography>
                                {renderDifferencesTable(addedRows, '#d4edda')}
                            </>
                        )}
                        {deletedRows.length > 0 && (
                            <>
                                <Typography variant="h6">Deleted Rows:</Typography>
                                {renderDifferencesTable(deletedRows, '#f8d7da')}
                            </>
                        )}
                        {modifiedRows.length > 0 && (
                            <>
                                <Typography variant="h6">Modified Rows:</Typography>
                                {renderDifferencesTable(modifiedRows, '#fff3cd', modifiedCells)}
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBeforeAfterClose} color="inherit">Cancel</Button>
                    <Tooltip title={hasDuplicates ? "Cannot confirm changes due to duplicates" : hasCollisions ? "Cannot confirm changes due to unique key collisions" : "Confirm changes"}>
                        <span>
                            <Button
                                onClick={handleConfirmChanges}
                                color="primary"
                                disabled={hasDuplicates || hasCollisions}
                            >
                                Confirm
                            </Button>
                        </span>
                    </Tooltip>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CMPS_Table;
