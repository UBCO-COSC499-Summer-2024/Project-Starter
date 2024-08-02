'use client'
import { useState, ChangeEvent } from 'react';
import supabase from '@/app/components/supabaseClient';
import Container from 'react-bootstrap/Container';
import { Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Export() {
    const [selectedTable, setSelectedTable] = useState('');
    const [tableData, setTableData] = useState([]);

    const tables = [
        "instructor",
        "service_role",
        "course",
        "course_assign",
        "service_role_assign",
        "event",
        "service_hours_entry",
        "event_attendance",
        "evaluation_type",
        "evaluation_metric",
        "evaluation_entry",
        "service_hours_benchmark"
    ];

    const handleTableSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
        const tableName = event.target.value;
        setSelectedTable(tableName);

        if (tableName) {
            // Fetch data from the selected table
            const { data, error } = await supabase.from(tableName).select();
            if (error) {
                console.error(`Error fetching data from ${tableName}:`, error);
            } else {
                console.log(`Fetched data from ${tableName}:`, data);
                setTableData(data);
            }
        } else {
            setTableData([]);
        }
    };

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, selectedTable);

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${selectedTable}.xlsx`);
    };

    return (
        <Container>
            <h1>Export Table Data</h1>
            <Form.Group controlId="selectTable">
                <Form.Control as="select" value={selectedTable} onChange={handleTableSelect}>
                    <option value="">Select a table</option>
                    {tables.map((table, index) => (
                        <option key={index} value={table}>{table}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            {tableData.length > 0 && (
                <Button
                    variant="outline-primary"
                    onClick={handleDownload}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderWidth: '2px',
                        borderColor: '#007bff',
                        color: '#007bff',
                        backgroundColor: 'transparent'
                    }}
                >
                    Download Excel
                </Button>
            )}
        </Container>
    );
}
