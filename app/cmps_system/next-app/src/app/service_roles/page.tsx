'use client';

import Container from 'react-bootstrap/Container';
import Navbar from "@/app/components/NavBar";
import Link from 'next/link';
import Image from 'next/image';
import { Row } from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../supabaseClient';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Home() {
    const tableColumns = [
        {
            field: 'title',
            headerName: 'Service Role',
            width: 200,
            editable: false,
            renderCell: (params) => (
                <Link href={`/service_roles/service_role_detail?title=${params.row.title}&description=${params.row.description}&default_expected_hours=${params.row.default_expected_hours}&building=${params.row.building}&room_num=${params.row.room_num}`} legacyBehavior>
                    {params.value}
                </Link>
            )
        },
        { field: 'description', headerName: 'Description', width: 300, editable: true },
        { field: 'default_expected_hours', headerName: 'Default Monthly Hours', width: 200, editable: true },
        { field: 'assignees', headerName: 'Number of Assignees', width: 200, editable: true }
    ];

    const [serviceRoles, setServiceRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('service_role')
                    .select(`
                        service_role_id,
                        title,
                        description,
                        default_expected_hours,
                        building,
                        room_num,
                        service_role_assign (instructor_id)
                    `);
                if (error) throw error;

                const transformedData = data.map((role) => ({
                    id: role.service_role_id,
                    title: role.title,
                    description: role.description,
                    default_expected_hours: role.default_expected_hours,
                    building: role.building,
                    room_num: role.room_num,
                    assignees: role.service_role_assign.length
                }));

                setServiceRoles(transformedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderTable = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
        if (error) {
            return <p>Error fetching service roles: {error}</p>;
        }
        return (
            <Container>
                <Row className="h-32">
                    <div className="tw-p-3">
                        <DataGrid
                            editMode="row"
                            rows={serviceRoles}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                        />
                    </div>
                </Row>
            </Container>
        );
    };

    return (
        <main>
            <Navbar />
            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h1 style={{ marginRight: "10px" }}>Service Roles</h1>
                <Link href="/service_roles/create_new_service_role" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
                    <Image src="/plus.svg" alt="Add new service roles plus icon" width={20} height={20} style={{ margin: '20px' }} />
                    Create new service role
                </Link>
            </span>
            {renderTable()}
        </main >
    );
}
