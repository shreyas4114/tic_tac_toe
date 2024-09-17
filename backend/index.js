// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
const mctsRouter = require('./mctsRoutes');
app.use('/api', mctsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
