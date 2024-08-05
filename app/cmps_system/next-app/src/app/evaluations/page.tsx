'use client'
import React, { useState, useEffect } from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";
import { Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Bar } from 'react-chartjs-2';

const aggregationMethods = ['Average', 'Count', 'Sum', 'Max', 'Min'];

export default function Evaluations() {
    const router = useRouter();
    const fetchUrl = "v_evaluations_page";
    const tableName = "evaluation_entry";
    const initialSortModel = [
        { field: 'id', sort: 'desc' },
    ];

    const columnsConfig = [
        { field: 'id', headerName: 'ID', width: 100, editable: false },
        {
            field: 'evaluation_type',
            headerName: 'Evaluation Type',
            width: 200,
            editable: false,
            linkConfig: { prefix: '/evaluations/evaluation_type_info?id=', idField: 'evaluation_type_id' }
        },
        {
            field: 'instructor_full_name',
            headerName: 'Instructor',
            width: 150,
            editConfig: { type: 'searchModal', modalType: 'instructor', canEdit: (row) => row.requires_instructor !== false },
            linkConfig: { prefix: '/instructors/instructor_info?id=', idField: 'instructor_id' }
        },
        {
            field: 'course',
            headerName: 'Course',
            width: 150,
            editConfig: { type: 'searchModal', modalType: 'course', canEdit: (row) => row.requires_course !== false },
            linkConfig: { prefix: '/courses/course_info?id=', idField: 'course_id' }
        },
        {
            field: 'service_role',
            headerName: 'Service Role',
            width: 200,
            editConfig: { type: 'searchModal', modalType: 'service_role', canEdit: (row) => row.requires_service_role !== false },
            linkConfig: { prefix: '/service_roles/service_role_info?id=', idField: 'service_role_id' }
        },
        { field: 'question_num', headerName: 'Question', width: 100, editable: false },
        { field: 'question', headerName: 'Question Text', width: 300, editable: false },
        { field: 'answer', headerName: 'Answer', width: 150, editable: true },
        { field: 'evaluation_date', headerName: 'Date', width: 200, editable: true }
    ];

    const rowUpdateHandler = async (row) => {
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
            return { error }; // Ensure error is returned here
        }
    };

    const [filteredData, setFilteredData] = useState([]);
    const [independentVariable, setIndependentVariable] = useState('evaluation_date');
    const [aggregationMethod, setAggregationMethod] = useState('Average');
    const [errorMessage, setErrorMessage] = useState('');
    const [showVisualization, setShowVisualization] = useState(false);

    const handleFilteredDataChange = (data) => {
        setFilteredData(data);
    };

    useEffect(() => {
        if (filteredData.length > 0) {
            const evaluationTypes = new Set(filteredData.map(item => item.evaluation_type));
            if (evaluationTypes.size > 1) {
                setErrorMessage('All table rows must be filtered down to the same "Evaluation Type" to visualize.');
            } else {
                setErrorMessage('');
            }
        }
    }, [filteredData]);

    const getChartData = () => {
        if (errorMessage || filteredData.length === 0) return { labels: [], datasets: [] };

        const metricNums = new Set(filteredData.map(item => item.metric_num));
        const isSingleMetric = metricNums.size === 1;

        let labels = [];
        let data = [];

        if (isSingleMetric) {
            labels = Array.from(new Set(filteredData.map(item => item[independentVariable]))).sort();
            data = labels.map(label => {
                const items = filteredData.filter(item => item[independentVariable] === label);
                switch (aggregationMethod) {
                    case 'Count':
                        return items.length;
                    case 'Sum':
                        return items.reduce((acc, curr) => acc + Number(curr.answer), 0);
                    case 'Max':
                        return Math.max(...items.map(item => Number(item.answer)));
                    case 'Min':
                        return Math.min(...items.map(item => Number(item.answer)));
                    case 'Average':
                    default:
                        return items.reduce((acc, curr) => acc + Number(curr.answer), 0) / items.length;
                }
            });
        } else {
            labels = Array.from(metricNums).sort((a, b) => a - b);
            data = labels.map(metric => {
                const items = filteredData.filter(item => item.metric_num === metric);
                switch (aggregationMethod) {
                    case 'Count':
                        return items.length;
                    case 'Sum':
                        return items.reduce((acc, curr) => acc + Number(curr.answer), 0);
                    case 'Max':
                        return Math.max(...items.map(item => Number(item.answer)));
                    case 'Min':
                        return Math.min(...items.map(item => Number(item.answer)));
                    case 'Average':
                    default:
                        return items.reduce((acc, curr) => acc + Number(curr.answer), 0) / items.length;
                }
            });
        }

        return {
            labels,
            datasets: [
                {
                    label: `${filteredData[0].evaluation_type} vs. ${independentVariable}`,
                    data,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                }
            ]
        };
    };

    const chartData = getChartData();

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', flexWrap: 'nowrap' }}>
                <h1 style={{ marginRight: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>Evaluations</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Button onClick={() => setShowVisualization(!showVisualization)} variant="contained" color="primary">
                        {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
                    </Button>
                    {showVisualization && (
                        <>
                            <FormControl variant="outlined" style={{ minWidth: 120 }}>
                                <InputLabel>Independent Variable</InputLabel>
                                <Select
                                    value={independentVariable}
                                    onChange={(e) => setIndependentVariable(e.target.value)}
                                    label="Independent Variable"
                                    disabled={filteredData.length > 0 && new Set(filteredData.map(item => item.metric_num)).size > 1}
                                >
                                    <MenuItem value="evaluation_date">Date</MenuItem>
                                    {/* Add more independent variables if needed */}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" style={{ minWidth: 120 }}>
                                <InputLabel>Aggregation Method</InputLabel>
                                <Select
                                    value={aggregationMethod}
                                    onChange={(e) => setAggregationMethod(e.target.value)}
                                    label="Aggregation Method"
                                >
                                    {aggregationMethods.map(method => (
                                        <MenuItem key={method} value={method}>{method}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                    <Button onClick={() => { router.push("/evaluations/evaluation_types") }} variant="contained" color="primary">
                        View Evaluation Types
                    </Button>
                </div>
            </div>
            {showVisualization && (
                <>
                    {errorMessage ? (
                        <Alert severity="info">{errorMessage}</Alert>
                    ) : (
                        <div>
                            <Box
                                sx={{
                                    height: '50vh',
                                    width: '100%',
                                    padding: '10px'
                                }}
                            >
                                <Typography variant="h6" align="center" gutterBottom>
                                    {`${filteredData[0]?.evaluation_type || ''} vs. ${independentVariable}`}
                                </Typography>
                                <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                            </Box>
                        </div>
                    )}
                </>
            )}
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                deleteWarningMessage="Are you sure you want to delete this evaluation?"
                idColumn="evaluation_entry_id"
                newRecordURL="/evaluations/enter_evaluation"
                uniqueColumns={["evaluation_type_id",
                    "metric_num",
                    "course_id",
                    "instructor_id",
                    "service_role_id",
                    "evaluation_date"]}
                onFilteredDataChange={handleFilteredDataChange}
            />
        </>
    );
}
