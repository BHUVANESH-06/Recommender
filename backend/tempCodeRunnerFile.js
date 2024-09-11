const express = require('express');
const { exec } = require('child_process');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api/recommend', (req, res) => {
    const movieTitle = req.query.title;
    
    if (!movieTitle) {
        return res.status(400).json({ error: 'Movie title is required' });
    }

    const pythonScriptPath = './backend/recommendations.py';
    const command = `python ${pythonScriptPath} "${movieTitle}"`;
    console.log(command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ error: 'Failed to get recommendations' });
        }
    
        const recommendations = stdout
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');
        console.log(recommendations);  
        res.json(recommendations);
    });
});

app.get('/api/top', (req, res) => {
    const pythonScriptPath = './backend/demographic.py';
    const command = `python ${pythonScriptPath}`;
    console.log(command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ error: 'Failed to get recommendations' });
        }
    
        const top = stdout
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');
        console.log(top);  
        res.json(top);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
