'use client'
import React, { useState } from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { Bar } from 'react-chartjs-2';

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
    const [showChart, setShowChart] = useState(true);

    const handleFilteredDataChange = (data) => {
        setFilteredData(data);
    };

    const dataForChart = {
        labels: filteredData.map(item => item.evaluation_type),
        datasets: [
            {
                label: 'Answers',
                data: filteredData.map(item => item.answer),
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ]
    };

    const toggleChartVisibility = () => {
        setShowChart(prevShowChart => !prevShowChart);
    };

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', flexWrap: 'nowrap' }}>
                <h1 style={{ marginRight: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>Evaluations</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button onClick={toggleChartVisibility} variant="contained" color="primary" style={{ marginRight: '10px' }}>
                        {showChart ? "Hide Visualization" : "Show Visualization"}
                    </Button>
                    <Button onClick={() => { router.push("/evaluations/evaluation_types") }} variant="contained" color="primary">
                        View Evaluation Types
                    </Button>
                </div>
            </div>
            {showChart && (
                <div style={{ height: '50vh', width: '100%' }}>
                    <Bar data={dataForChart} options={{ maintainAspectRatio: false }} />
                </div>
            )}
            <div style={{ height: showChart ? '50vh' : '100vh', width: '100%' }}>
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
            </div>
        </>
    );
}
