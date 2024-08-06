'use client'
import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import getUserType from '../components/getUserType';
import { Form, Tab, Tabs } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';


const Instructor = () => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'course', headerName: 'Course'},
        { field: 'reviewer', headerName: 'Reviewer'},
        { field: 'reviewee', headerName: 'Reviewee'},
        { field: 'activate', headerName: 'Activate'},
        { field: 'review', headerName: 'Review'},
        { field: 'score', headerName: 'Score'},
        { field: '', headerName: 'Write Review', renderCell: (params) => {
            return <Button variant="primary" key={params.row.id} onClick={()=>{
                alert(params.row.id)
            }}>Write Review</Button>
        }, width: 150 },
      ];

    const rows = [
        { id: 1, course: 'Math', reviewer: 'John', reviewee: 'Jane', activate: "Y", review: 'Good job!', score: "10" },
        { id: 2, course: 'Science', reviewer: 'Alice', reviewee: 'Bob', activate: "Y", review: 'Needs improvement.', score: "10" },
        { id: 3, course: 'English', reviewer: 'Emily', reviewee: 'David', activate: "Y", review: 'Excellent work!', score: "10" },
    ];

    return <>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10]}
        />
    </>
}

const Head = () => {
    return <></>
}
export default function Tools() {
    /**
     * This page is the review for TA. If the user is an insturctor, they can see their TA and give them review if available. If the user is head, they can 
     * request a review from instructor for their TA and see their reviews. This page is different than other tables so it is not using the CMPS_Table component.
    */
    const [userType, setUserType] = useState('instructor');
    useEffect(() => {
        getUserType().then((res) => {
            setUserType(res);
        });
    }, []);
    return (
        <main>
            <Navbar />
            <div className="tw-p-10">
                <Tabs
                    defaultActiveKey="inst"
                    id="uncontrolled-tab-example"

                >
                    <Tab eventKey="inst" title="Instructor View">
                        <Instructor />
                    </Tab>
                    {userType == "instructor" || <Tab eventKey="head" title="Head View">
                        <Head />
                    </Tab>}
                </Tabs>
            </div>
        </main>
    );
}
