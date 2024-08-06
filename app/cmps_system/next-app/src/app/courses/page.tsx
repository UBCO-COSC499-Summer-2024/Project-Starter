'use client'
import React from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";
import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default function Courses() {
    const fetchUrl = "v_courses_with_instructors";
    const tableName = "course";
    const initialSortModel = [
        { field: 'course_title', sort: 'asc' },
    ];

    const columnsConfig = [
        { field: 'id', headerName: 'ID', width: 100, editable: false },
        { field: 'subject_code', headerName: 'Subject', flex: 1, editable: true },
        { field: 'course_num', headerName: 'Course No.', flex: 1, editable: true },
        {
            field: 'section_num',
            headerName: 'Section',
            flex: 1,
            editable: true,
            linkConfig: { prefix: '/courses/course_info?id=', idField: 'id' }
        },
        { field: 'course_title', headerName: 'Course Title', flex: 2, editable: true },
        { field: 'academic_year', headerName: 'Academic Year', flex: 1, editable: true },
        {
            field: 'session',
            headerName: 'Session',
            flex: 1,
            editable: true,
            editConfig: { type: 'select', options: ['Winter', 'Summer'] }
        },
        {
            field: 'term',
            headerName: 'Term',
            flex: 1,
            editable: true,
            editConfig: { type: 'select', options: ['Term 1', 'Term 2', 'Term 1-2'] }
        },
        {
            field: 'instructor_names',
            headerName: 'Instructors',
            flex: 2,
            editable: false,
            renderCell: (params) => {
                const names = params.row.instructor_names.split(', ');
                const ids = params.row.instructor_ids.split(', ');
                return (
                    <div>
                        {names.map((name, index) => (
                            <React.Fragment key={ids[index]}>
                                <Link href={`/instructors/instructor_info?id=${ids[index]}`} passHref>
                                    {name}
                                </Link>
                                {index < names.length - 1 && <span>, </span>}
                            </React.Fragment>
                        ))}
                    </div>
                );
            }
        },
        { field: 'num_students', headerName: 'Students', flex: 1, editable: true },
        { field: 'num_tas', headerName: 'TAs', flex: 1, editable: true },
        { field: 'average_grade', headerName: 'Avg. Grade', flex: 1, editable: true },
        { field: 'location', headerName: 'Location', flex: 1, editable: true },
    ];

    const rowUpdateHandler = async (row) => {
        const { error } = await supabase.from("course").update({
            course_id: row.id,
            course_title: row.course_title,
            building: row.location.split(" ")[0],
            room_num: row.location.split(" ")[1],
            num_students: row.num_students,
            num_tas: row.num_tas,
            term: row.term,
            academic_year: row.academic_year,
            subject_code: row.subject_code,
            course_num: row.course_num,
            section_num: row.section_num,
            average_grade: row.average_grade,
            year_level: row.year_level,
            session: row.session
        }).eq("course_id", row.id);

        if (error) {
            return { error };
        }
    };

    const exportICS = async () => {
        /**
         * This function will export courses that belongs to the current user to a ics file.
         * The ics file will be downloaded to the user's local machine.
         */
        const event = {
            start: [2018, 5, 30, 6, 30],
            duration: { hours: 6, minutes: 30 },
            title: 'Bolder Boulder',
            description: 'Annual 10-kilometer run in Boulder, Colorado',
            location: 'Folsom Field, University of Colorado (finish line)',
            url: 'http://www.bolderboulder.com/',
            geo: { lat: 40.0095, lon: 105.2669 },
            categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
            attendees: [
              { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
              { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
            ]
        }
        const my_courses = await supabase.from("course").select("*").eq("instructor_ids", supabase.auth.user().id);
    }
    return (
        <> 
            <Navbar />
            <h1>Courses</h1> 
            <a href="#" onClick={exportICS} className="tw-pl-5" style={{color: "blue", textDecoration:"underline"}}>📅Export My Courses to Calendar</a>
            <CMPS_Table
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialSortModel={initialSortModel}
                tableName={tableName}
                rowUpdateHandler={rowUpdateHandler}
                idColumn="course_id"
                deleteWarningMessage="Are you sure you want to delete the selected courses? All related teaching assignments and evaluation entries will be deleted as well. This action is not recoverable!"
                newRecordURL="/courses/create_new_course"
                uniqueColumns={["academic_year",
                    "session",
                    "term",
                    "subject_code",
                    "course_num",
                    "section_num"]}
            />
        </>
    );
}