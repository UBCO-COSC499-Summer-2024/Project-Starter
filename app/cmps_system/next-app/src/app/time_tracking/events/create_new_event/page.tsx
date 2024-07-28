'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);

export default function CreateNewEvent() {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [eventDatetime, setEventDatetime] = useState('');
    const [duration, setDuration] = useState('');
    const [isMeeting, setIsMeeting] = useState(false);
    const { push } = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Form validation logic here if needed

        const { data, error } = await supabase
            .from('event')
            .insert([
                { 
                    description,
                    location,
                    event_datetime: new Date(eventDatetime).toISOString(),
                    duration,
                    is_meeting: isMeeting
                }
            ]);

        if (error) {
            console.error('Error creating event:', error);
            // Optionally handle error, e.g., display a message to the user
        } else {
            // Redirect to events page or display a success message
            push('/time_tracking/events');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Event
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Date and Time"
                    type="datetime-local"
                    value={eventDatetime}
                    onChange={(e) => setEventDatetime(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    fullWidth
                    label="Duration (HH:MM:SS)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    margin="normal"
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isMeeting}
                            onChange={(e) => setIsMeeting(e.target.checked)}
                        />
                    }
                    label="Is this a meeting?"
                />
                <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
                    Create Event
                </Button>
            </form>
        </Container>
    );
}
