'use client';

import React from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";

export default function ServiceRoles() {
    const fetchUrl = "v_service_roles_page";
    const tableName = "service_role";
    const initialSortModel = [
        { field: 'title', sort: 'asc' },
    ];

    const columnsConfig = [
        { field: 'id', headerName: 'ID', width: 50, editable: false },
        {
            field: 'title',
            headerName: 'Service Role',
            flex: 1,
            editable: true,
            linkConfig: { prefix: '/service_roles/service_role_info?id=', idField: 'id' }
        },
        { field: 'description', headerName: 'Description', flex: 1, editable: false },
        { field: 'default_expected_hours', headerName: 'Default Monthly Hours', flex: 1, editable: true },
        { field: 'assignees', headerName: 'Number of Assignees', flex: 1, editable: false },
        { field: 'building', headerName: 'Building', flex: 1, editable: true },
        { field: 'room_num', headerName: 'Room', flex: 1, editable: true }
    ];

    const rowUpdateHandler = async (row) => {
        const { error } = await supabase
            .from('service_role')
            .update({
                title: row.title,
                default_expected_hours: row.default_expected_hours,
                building: row.building,
                room: row.room
            })
            .eq('service_role_id', row.id);

        if (error) {
            return { error };
        }
    };

    return (
        <>
            <Navbar />
            <h1>Service Roles</h1>
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                idColumn="service_role_id"
                deleteWarningMessage="Are you sure you want to delete the selected service roles? All associated service role assignments AND service hours entries will be deleted as well. This action is not recoverable!"
                newRecordURL="/service_roles/create_new_service_role"
            />
        </>
    );
}
