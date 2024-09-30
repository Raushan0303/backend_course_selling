import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Controller for creating a new meeting
export const joinMeeting = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: 'Name is required to create a meeting.' });
        }

        // Generate a new meeting ID
        const meetingId = uuidv4();
        // Redirect to the generated meeting room URL with the name as query parameter
        res.redirect(`/join/${meetingId}?name=${encodeURIComponent(name)}`);
    } catch (error) {
        console.error('Error in joinMeeting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller for joining an existing meeting
export const joinOldMeeting = async (req, res) => {
    try {
        const { meeting_id, name } = req.query;

        if (!meeting_id || !name) {
            return res.status(400).json({ error: 'Meeting ID and name are required to join a meeting.' });
        }

        // Redirect to the existing meeting room URL with the name as query parameter
        res.redirect(`/join/${encodeURIComponent(meeting_id)}?name=${encodeURIComponent(name)}`);
    } catch (error) {
        console.error('Error in joinOldMeeting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to serve the meeting room page
export const joinRoom = async (req, res) => {
    try {
        const { rooms } = req.params; // Meeting ID
        const { name } = req.query;   // User's name

        // Serve the room HTML page, you might want to use a template engine here (e.g., EJS, Handlebars)
        res.sendFile(path.resolve('./public/room.html'));  // Change path based on your file structure

        // If using a template engine, you can pass the room ID and user name
        // res.render('room', { roomId: rooms, userName: name });
    } catch (error) {
        console.error('Error in joinRoom:', error);
        res.status(500).send('Internal Server Error');
    }
};
