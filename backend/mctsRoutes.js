const express = require('express');
const router = express.Router();
const { Node, monteCarloTreeSearch } = require('./mcts');

router.post('/getBestMove', (req, res) => {
    const { boardState, player } = req.body;
    const root = new Node(boardState);
    const bestMove = monteCarloTreeSearch(root, player);
    res.json({ bestMove });
});

module.exports = router;
