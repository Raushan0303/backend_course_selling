import { v4 as uuidv4 } from 'uuid';
import path from 'path';


export const createMeeting = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name) {
            return res.status(400).json({ error: 'Name is required to create a meeting.' });
        }
        const meetingId = uuidv4();

        const redirectUrl = `/room/${meetingId}?name=${encodeURIComponent(name)}`;
        res.status(200).json({ redirectUrl });
    } catch (error) {
        console.error('Error in createMeeting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const joinExistingMeeting = async (req, res) => {
    try {
        const { meeting_id, name } = req.query;

        if (!meeting_id || !name) {
            return res.status(400).json({ error: 'Meeting ID and name are required to join a meeting.' });
        }

    
        res.redirect(`/room/${encodeURIComponent(meeting_id)}?name=${encodeURIComponent(name)}`);
    } catch (error) {
        console.error('Error in joinExistingMeeting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const joinRoom = async (req, res) => {
    try {
        const { rooms } = req.params; 
        const { name } = req.query;   

      
        const filePath = path.resolve('./public/room.html');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving room.html:', err);
                res.status(404).send('Room not found');
            }
        });
    } catch (error) {
        console.error('Error in joinRoom:', error);
        res.status(500).send('Internal Server Error');
    }
};
