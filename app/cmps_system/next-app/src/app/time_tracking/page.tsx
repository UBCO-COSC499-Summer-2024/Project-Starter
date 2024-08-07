'use client'
import React, { useState, useEffect } from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";
import { Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, Alert, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend
);

const aggregationMethods = ['Average', 'Count', 'Sum', 'Max', 'Min'];

export default function TimeTracking() {
    const router = useRouter();
    const fetchUrl = "v_timetracking"; // URL to fetch data from the database view
    const tableName = "service_hours_entry"; // Name of the table to update
    const initialSortModel = [
        { field: 'id', sort: 'desc' },
    ];

    // Configuration for the columns in the table
    const columnsConfig = [
        { field: 'id', headerName: 'ID', width: 75, editable: false },
        {
            field: 'instructor_full_name',
            headerName: 'Instructor',
            flex: 1,
            editConfig: { type: 'searchModal', modalType: 'instructor' },
            linkConfig: { prefix: '/instructors/instructor_info?id=', idField: 'instructor_id' }
        },
        {
            field: 'service_role',
            headerName: 'Service Role',
            flex: 1,
            editConfig: { type: 'searchModal', modalType: 'service_role' },
            linkConfig: { prefix: '/service_roles/service_role_info?id=', idField: 'service_role_id' }
        },
        { field: 'year', headerName: 'Year', flex: 1, editable: true },
        { field: 'month', headerName: 'Month', flex: 1, editable: true },
        { field: 'hours', headerName: 'Hours', flex: 1, editable: true }
    ];

    // Handler to update a row in the table
    const rowUpdateHandler = async (row) => {
        const { error } = await supabase
            .from('service_hours_entry')
            .upsert({
                service_hours_entry_id: row.id,
                instructor_id: row.instructor_id,
                service_role_id: row.service_role_id,
                year: row.year,
                hours: row.hours,
                month: row.month
            });

        if (error) {
            return { error }; // Ensure error is returned here
        }
    };

    const [filteredData, setFilteredData] = useState([]);
    const [independentVariable, setIndependentVariable] = useState('month');
    const [aggregationMethod, setAggregationMethod] = useState('Average');
    const [errorMessage, setErrorMessage] = useState('');
    const [showVisualization, setShowVisualization] = useState(false);

    const handleFilteredDataChange = (data) => {
        setFilteredData(data);
    };

    const hasValues = (variable) => {
        return filteredData.some(item => item[variable] !== undefined && item[variable] !== null && item[variable] !== '');
    };

    const handleIndependentVariableChange = (e) => {
        const value = e.target.value;
        if (hasValues(value)) {
            setIndependentVariable(value);
        }
    };

    useEffect(() => {
        if (filteredData.length > 0) {
            const serviceRoles = new Set(filteredData.map(item => item.service_role));
            if (serviceRoles.size > 1) {
                setErrorMessage('All table rows must be filtered down to the same "Service Role" to visualize.');
            } else {
                setErrorMessage('');
            }
        } else {
            setErrorMessage('No data available.');
        }
    }, [filteredData]);

    const getChartData = () => {
        if (errorMessage || filteredData.length === 0) return { labels: [], datasets: [] };

        let labels = Array.from(new Set(filteredData.map(item => item[independentVariable]))).sort();
        let data = labels.map(label => {
            const items = filteredData.filter(item => item[independentVariable] === label);
            switch (aggregationMethod) {
                case 'Count':
                    return items.length;
                case 'Sum':
                    return items.reduce((acc, curr) => acc + Number(curr.hours), 0);
                case 'Max':
                    return Math.max(...items.map(item => Number(item.hours)));
                case 'Min':
                    return Math.min(...items.map(item => Number(item.hours)));
                case 'Average':
                default:
                    return items.reduce((acc, curr) => acc + Number(curr.hours), 0) / items.length;
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: `${filteredData[0]?.service_role ?? ''} ${independentVariable}`,
                    data,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                }
            ]
        };
    };

    const chartData = getChartData();

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const index = context.dataIndex;
                        const count = chartData.datasets[0].data[index];
                        return `${context.dataset.label}: ${context.raw} (N=${count})`;
                    }
                }
            }
        },
        layout: {
            padding: {
                bottom: 20
            }
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', flexWrap: 'nowrap' }}>
                <h1 style={{ marginRight: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>Time Tracking</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button onClick={() => { router.push("/time_tracking/benchmarks") }} variant="contained" color="primary">
                        Service Hours Benchmarks
                    </Button>
                    <Button onClick={() => { router.push("/time_tracking/events") }} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                        Events
                    </Button>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
                <Button onClick={() => setShowVisualization(!showVisualization)} variant="contained" color="primary">
                    {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
                </Button>
                {showVisualization && (
                    <>
                        <FormControl variant="outlined" style={{ minWidth: 180 }}>
                            <InputLabel>Independent Variable</InputLabel>
                            <Select
                                value={independentVariable}
                                onChange={handleIndependentVariableChange}
                                label="Independent Variable"
                            >
                                <MenuItem value="month">Month</MenuItem>
                                {hasValues('year') && <MenuItem value="year">Year</MenuItem>}
                                {hasValues('instructor_full_name') && <MenuItem value="instructor_full_name">Instructor</MenuItem>}
                                {hasValues('service_role') && <MenuItem value="service_role">Service Role</MenuItem>}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" style={{ minWidth: 180 }}>
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
            </div>
            {showVisualization && (
                <>
                    {errorMessage ? (
                        <Alert severity="info">{errorMessage}</Alert>
                    ) : (
                        <Box sx={{ height: '50vh', width: '100%', padding: '10px' }}>
                            <Typography variant="h6" align="center">
                                {`${aggregationMethod} ${filteredData[0]?.service_role ?? ''} ${independentVariable}`}
                            </Typography>
                            <Bar key={`${independentVariable}-${aggregationMethod}`} data={chartData} options={chartOptions} />
                        </Box>
                    )}
                </>
            )}
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                deleteWarningMessage="Are you sure you want to delete these service hours records?"
                idColumn="service_hours_entry_id"
                uniqueColumns={["instructor_id",
                    "service_role_id",
                    "year",
                    "month"]}
                onFilteredDataChange={handleFilteredDataChange}
            />
        </>
    );
}

