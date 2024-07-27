'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import { createClient } from '@supabase/supabase-js'
import supabase from "@/app/components/supabaseClient";
const ServiceRoleDetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const title = searchParams.get('title');
  const description = searchParams.get('description');
  const defaultExpectedHours = searchParams.get('default_expected_hours');
  const building = searchParams.get('building');
  const roomNum = searchParams.get('room_num');

  const [serviceRole, setServiceRole] = useState({
    title,
    description,
    default_expected_hours: defaultExpectedHours,
    building,
    room_num: roomNum,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (title) {
      const fetchServiceRoleData = async () => {
        try {
          const { data: serviceRoleData, error: serviceRoleError } = await supabase
            .from('service_role')
            .select('*')
            .eq('title', title)
            .single();
          
          if (serviceRoleError) throw serviceRoleError;
          setServiceRole(serviceRoleData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchServiceRoleData();
    }
  }, [title]);

  const handleDelete = async () => {
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('service_role')
        .delete()
        .eq('title', title);
      if (error) throw error;
      alert('Service role removed successfully');
      router.push('/service_roles');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <Container fluid className="banner">
        <h2>Service Role Info</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching service role: {error}</p>
        ) : serviceRole ? (
          <>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Service Role Name</td>
                  <td>{serviceRole.title}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{serviceRole.description}</td>
                </tr>
                <tr>
                  <td>Building</td>
                  <td>{serviceRole.building}</td>
                </tr>
                <tr>
                  <td>Room Number</td>
                  <td>{serviceRole.room_num}</td>
                </tr>
                <tr>
                  <td>Default Expected Hours</td>
                  <td>{serviceRole.default_expected_hours}</td>
                </tr>
              </tbody>
            </table>
            <div className="instructor-info-footer">
              <button className="btn btn-danger" onClick={handleDelete}>Remove this service role</button>
              <button className="btn btn-secondary" onClick={() => router.push('/service_roles')}>Back</button>
            </div>
          </>
        ) : (
          <p>Service role not found</p>
        )}
      </Container>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to remove this service role?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceRoleDetail;
