'use client'
import React from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function EvaluationTypes() {
    const router = useRouter();
    const fetchUrl = "v_evaluation_type_info";
    const tableName = "evaluation_type";
    const initialSortModel = [
        { field: 'evaluation_type_id', sort: 'desc' }
    ];

    const columnsConfig = [
        {
            field: 'id',
            headerName: 'ID',
            width: 75,
            editable: false
        },
        {
            field: 'name',
            headerName: 'Evaluation Type',
            flex: 2,
            editable: true,
            linkConfig: { prefix: '/evaluations/evaluation_type_info?id=', idField: 'id' }
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 3,
            editable: true
        },
        {
            field: 'num_entries',
            headerName: 'Number of Questions',
            flex: 1,
            editable: false
        },
        {
            field: 'date_added',
            headerName: 'Date Added',
            flex: 1,
            editable: true
        },
        {
            field: 'requires_course',
            headerName: 'Requires Course',
            flex: 1,
            editable: false,
            type: 'boolean'
        },
        {
            field: 'requires_instructor',
            headerName: 'Requires Instructor',
            flex: 1,
            editable: false,
            type: 'boolean'
        },
        {
            field: 'requires_service_role',
            headerName: 'Requires Service Role',
            flex: 1,
            editable: false,
            type: 'boolean'
        }
    ];

    const rowUpdateHandler = async (row) => {
        const { error } = await supabase
            .from('evaluation_type')
            .update({
                evaluation_type_name: row.name,
                description: row.description,
                date_added: row.date_added
            })
            .eq('evaluation_type_id', row.id);

        if (error) {
            return { error };
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', flexWrap: 'nowrap' }}>
                <h1 style={{ marginRight: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>Evaluation Types</h1>
            </div>
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                deleteWarningMessage="Are you sure you want to delete this evaluation type?"
                idColumn="evaluation_type_id"
            />
        </>
    );
}
