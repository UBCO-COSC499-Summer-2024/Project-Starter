'use client';

import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);

const EvaluationTypeInfo = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const evaluationTypeName = searchParams.get('name');
    const description = searchParams.get('description');
    const requiresCourse = searchParams.get('requiresCourse') === 'true';
    const requiresInstructor = searchParams.get('requiresInstructor') === 'true';
    const requiresServiceRole = searchParams.get('requiresServiceRole') === 'true';

    const [evaluationType, setEvaluationType] = useState({
        evaluation_type_name: evaluationTypeName,
        description,
        requires_course: requiresCourse,
        requires_instructor: requiresInstructor,
        requires_service_role: requiresServiceRole,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [editEvaluationTypeMode, setEditEvaluationTypeMode] = useState({});
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteEvaluationTypeConfirmOpen, setDeleteEvaluationTypeConfirmOpen] = useState(false);
    const [metricToDelete, setMetricToDelete] = useState(null);
    const [addMetricOpen, setAddMetricOpen] = useState(false);
    const [newMetric, setNewMetric] = useState({
        metric_num: '',
        metric_description: '',
        min_value: '',
        max_value: ''
    });
    const [addMetricError, setAddMetricError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchEvaluationTypeData = async () => {
                try {
                    const { data: evaluationTypeData, error: evaluationTypeError } = await supabase
                        .from('evaluation_type')
                        .select('*')
                        .eq('evaluation_type_id', id)
                        .single();

                    if (evaluationTypeError) throw evaluationTypeError;
                    setEvaluationType(evaluationTypeData);

                    const { data: metricData, error: metricError } = await supabase
                        .from('evaluation_metric')
                        .select('*')
                        .eq('evaluation_type_id', id);

                    if (metricError) throw metricError;
                    setMetrics(metricData);

                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchEvaluationTypeData();
        }
    }, [id]);

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('evaluation_type')
                .delete()
                .eq('evaluation_type_id', id);
            if (error) throw error;
            alert('Evaluation type removed successfully');
            router.push('/evaluations/evaluation_types');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (metricNum) => {
        setEditMode((prevState) => ({ ...prevState, [metricNum]: !prevState[metricNum] }));
    };

    const handleEvaluationTypeEdit = (field) => {
        setEditEvaluationTypeMode((prevState) => ({ ...prevState, [field]: !prevState[field] }));
    };

    const handleSave = async (metric) => {
        const originalMetric = metrics.find(m => m.metric_num === metric.metric_num);
        if (
            metric.metric_description === originalMetric.metric_description &&
            metric.min_value === originalMetric.min_value &&
            metric.max_value === originalMetric.max_value
        ) {
            setEditMode((prevState) => ({ ...prevState, [metric.metric_num]: false }));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('evaluation_metric')
                .update({
                    metric_description: metric.metric_description,
                    min_value: metric.min_value,
                    max_value: metric.max_value,
                })
                .eq('evaluation_type_id', id)
                .eq('metric_num', metric.metric_num);

            if (error) throw error;
            alert('Metric updated successfully');
            setEditMode((prevState) => ({ ...prevState, [metric.metric_num]: false }));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluationTypeSave = async (field) => {
        if (evaluationType[field] === originalEvaluationType[field]) {
            setEditEvaluationTypeMode((prevState) => ({ ...prevState, [field]: false }));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('evaluation_type')
                .update({ [field]: evaluationType[field] })
                .eq('evaluation_type_id', id);

            if (error) throw error;
            alert('Evaluation type updated successfully');
            setEditEvaluationTypeMode((prevState) => ({ ...prevState, [field]: false }));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (metricNum, field, value) => {
        setMetrics((prevMetrics) =>
            prevMetrics.map((metric) =>
                metric.metric_num === metricNum ? { ...metric, [field]: value } : metric
            )
        );
    };

    const handleEvaluationTypeChange = (field, value) => {
        setEvaluationType((prevType) => ({ ...prevType, [field]: value }));
    };

    const openDeleteConfirm = (metric) => {
        setMetricToDelete(metric);
        setDeleteConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setMetricToDelete(null);
    };

    const handleDeleteMetric = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('evaluation_metric')
                .delete()
                .eq('evaluation_type_id', id)
                .eq('metric_num', metricToDelete.metric_num);

            if (error) throw error;
            alert('Metric deleted successfully');
            setMetrics((prevMetrics) => prevMetrics.filter((metric) => metric.metric_num !== metricToDelete.metric_num));
            closeDeleteConfirm();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const openAddMetric = () => {
        setAddMetricOpen(true);
    };

    const closeAddMetric = () => {
        setAddMetricOpen(false);
        setNewMetric({
            metric_num: '',
            metric_description: '',
            min_value: '',
            max_value: ''
        });
        setAddMetricError(null);
    };

    const handleAddMetric = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('evaluation_metric')
                .insert([{
                    evaluation_type_id: id,
                    metric_num: newMetric.metric_num,
                    metric_description: newMetric.metric_description,
                    min_value: newMetric.min_value || null,
                    max_value: newMetric.max_value || null,
                }]);

            if (error) throw error;
            alert('Metric added successfully');
            setMetrics([...metrics, { ...newMetric, evaluation_type_id: id }]);
            closeAddMetric();
        } catch (error) {
            setAddMetricError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNewMetricChange = (field, value) => {
        setNewMetric((prevMetric) => ({ ...prevMetric, [field]: value }));
    };

    const openDeleteEvaluationTypeConfirm = () => {
        setDeleteEvaluationTypeConfirmOpen(true);
    };

    const closeDeleteEvaluationTypeConfirm = () => {
        setDeleteEvaluationTypeConfirmOpen(false);
    };

    const originalEvaluationType = {
        evaluation_type_name: evaluationTypeName,
        description,
        requires_course: requiresCourse,
        requires_instructor: requiresInstructor,
        requires_service_role: requiresServiceRole,
    };

    return (
        <div>
            <NavBar />
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <h2>Evaluation Type Info</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error fetching evaluation type: {error}</p>
                ) : evaluationType ? (
                    <>
                        <TableContainer style={{ marginBottom: '20px' }}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>
                                            {editEvaluationTypeMode.evaluation_type_name ? (
                                                <TextField
                                                    value={evaluationType.evaluation_type_name}
                                                    onChange={(e) => handleEvaluationTypeChange('evaluation_type_name', e.target.value)}
                                                />
                                            ) : (
                                                evaluationType.evaluation_type_name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => editEvaluationTypeMode.evaluation_type_name ? handleEvaluationTypeSave('evaluation_type_name') : handleEvaluationTypeEdit('evaluation_type_name')}>
                                                {editEvaluationTypeMode.evaluation_type_name ? <SaveIcon /> : <EditIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>
                                            {editEvaluationTypeMode.description ? (
                                                <TextField
                                                    value={evaluationType.description}
                                                    onChange={(e) => handleEvaluationTypeChange('description', e.target.value)}
                                                />
                                            ) : (
                                                evaluationType.description
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => editEvaluationTypeMode.description ? handleEvaluationTypeSave('description') : handleEvaluationTypeEdit('description')}>
                                                {editEvaluationTypeMode.description ? <SaveIcon /> : <EditIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Requires Course</TableCell>
                                        <TableCell>
                                            {editEvaluationTypeMode.requires_course ? (
                                                <Checkbox
                                                    checked={evaluationType.requires_course}
                                                    onChange={(e) => handleEvaluationTypeChange('requires_course', e.target.checked)}
                                                />
                                            ) : (
                                                evaluationType.requires_course ? 'Yes' : 'No'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => editEvaluationTypeMode.requires_course ? handleEvaluationTypeSave('requires_course') : handleEvaluationTypeEdit('requires_course')}>
                                                {editEvaluationTypeMode.requires_course ? <SaveIcon /> : <EditIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Requires Instructor</TableCell>
                                        <TableCell>
                                            {editEvaluationTypeMode.requires_instructor ? (
                                                <Checkbox
                                                    checked={evaluationType.requires_instructor}
                                                    onChange={(e) => handleEvaluationTypeChange('requires_instructor', e.target.checked)}
                                                />
                                            ) : (
                                                evaluationType.requires_instructor ? 'Yes' : 'No'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => editEvaluationTypeMode.requires_instructor ? handleEvaluationTypeSave('requires_instructor') : handleEvaluationTypeEdit('requires_instructor')}>
                                                {editEvaluationTypeMode.requires_instructor ? <SaveIcon /> : <EditIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Requires Service Role</TableCell>
                                        <TableCell>
                                            {editEvaluationTypeMode.requires_service_role ? (
                                                <Checkbox
                                                    checked={evaluationType.requires_service_role}
                                                    onChange={(e) => handleEvaluationTypeChange('requires_service_role', e.target.checked)}
                                                />
                                            ) : (
                                                evaluationType.requires_service_role ? 'Yes' : 'No'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => editEvaluationTypeMode.requires_service_role ? handleEvaluationTypeSave('requires_service_role') : handleEvaluationTypeEdit('requires_service_role')}>
                                                {editEvaluationTypeMode.requires_service_role ? <SaveIcon /> : <EditIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <h3>Evaluation Metrics</h3>
                        <TableContainer style={{ marginBottom: '20px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Metric Number</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Min Value</TableCell>
                                        <TableCell>Max Value</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {metrics.map((metric) => (
                                        <TableRow key={metric.metric_num}>
                                            <TableCell>{metric.metric_num}</TableCell>
                                            <TableCell>
                                                {editMode[metric.metric_num] ? (
                                                    <TextField
                                                        value={metric.metric_description}
                                                        onChange={(e) => handleChange(metric.metric_num, 'metric_description', e.target.value)}
                                                    />
                                                ) : (
                                                    metric.metric_description
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editMode[metric.metric_num] ? (
                                                    <TextField
                                                        value={metric.min_value}
                                                        type="number"
                                                        onChange={(e) => handleChange(metric.metric_num, 'min_value', e.target.value)}
                                                    />
                                                ) : (
                                                    metric.min_value !== null ? metric.min_value : 'N/A'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editMode[metric.metric_num] ? (
                                                    <TextField
                                                        value={metric.max_value}
                                                        type="number"
                                                        onChange={(e) => handleChange(metric.metric_num, 'max_value', e.target.value)}
                                                    />
                                                ) : (
                                                    metric.max_value !== null ? metric.max_value : 'N/A'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => editMode[metric.metric_num] ? handleSave(metric) : handleEdit(metric.metric_num)}>
                                                    {editMode[metric.metric_num] ? <SaveIcon /> : <EditIcon />}
                                                </IconButton>
                                                <IconButton onClick={() => openDeleteConfirm(metric)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="contained" color="primary" onClick={openAddMetric} style={{ marginBottom: '20px' }}>
                            Add Evaluation Metric
                        </Button>
                        <div style={{ marginTop: '20px' }}>
                            <Button variant="contained" color="secondary" onClick={openDeleteEvaluationTypeConfirm}>Remove this evaluation type</Button>
                            <Button variant="contained" color="primary" onClick={() => router.push('/evaluations/evaluation_types')}>Back</Button>
                        </div>
                    </>
                ) : (
                    <p>Evaluation type not found</p>
                )}
            </Container>

            <Modal open={deleteConfirmOpen} onClose={closeDeleteConfirm}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: 'white',
                    padding: '16px',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <h2>Confirm Delete</h2>
                    <p>Do you really want to remove this metric? Any evaluation entries that reference this metric will be deleted as well.</p>
                    <Button variant="contained" color="secondary" onClick={closeDeleteConfirm}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleDeleteMetric}>Delete</Button>
                </div>
            </Modal>

            <Modal open={addMetricOpen} onClose={closeAddMetric}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: 'white',
                    padding: '16px',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <h2>Add Evaluation Metric</h2>
                    <TextField
                        label="Metric Number"
                        value={newMetric.metric_num}
                        onChange={(e) => handleNewMetricChange('metric_num', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Metric Description"
                        value={newMetric.metric_description}
                        onChange={(e) => handleNewMetricChange('metric_description', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Min Value"
                        value={newMetric.min_value}
                        type="number"
                        onChange={(e) => handleNewMetricChange('min_value', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Max Value"
                        value={newMetric.max_value}
                        type="number"
                        onChange={(e) => handleNewMetricChange('max_value', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    {addMetricError && <p style={{ color: 'red' }}>{addMetricError}</p>}
                    <div style={{ marginTop: '20px' }}>
                        <Button variant="contained" color="secondary" onClick={closeAddMetric}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleAddMetric} style={{ marginLeft: '10px' }}>Add</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={deleteEvaluationTypeConfirmOpen} onClose={closeDeleteEvaluationTypeConfirm}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: 'white',
                    padding: '16px',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <h2>Confirm Delete</h2>
                    <p>Do you really want to remove this evaluation type? Any evaluation entries that reference this type will be deleted as well.</p>
                    <Button variant="contained" color="secondary" onClick={closeDeleteEvaluationTypeConfirm}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleDelete}>Delete</Button>
                </div>
            </Modal>
        </div>
    );
};

export default EvaluationTypeInfo;
