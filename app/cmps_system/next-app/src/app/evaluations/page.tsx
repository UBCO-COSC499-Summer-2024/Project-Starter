'use client'
import React from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";

export default function Evaluations() {
    const fetchUrl = "v_evaluations_page";
    const tableName = "evaluation_entry";
    const initialSortModel = [
        { field: 'evaluation_date', sort: 'desc' },
        { field: 'evaluation_type', sort: 'asc' },
        { field: 'instructor_full_name', sort: 'asc' },
        { field: 'course', sort: 'asc' },
        { field: 'service_role', sort: 'asc' },
        { field: 'question_num', sort: 'asc' },
    ];

    const columnsConfig = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },
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
            console.error("Error updating record:", error);
        }
    };

    return (
        <>
            <Navbar />
            <h1>Evaluations</h1>
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                idColumn="evaluation_entry_id"
            />
        </>
    );
}
