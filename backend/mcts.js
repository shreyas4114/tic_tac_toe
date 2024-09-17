class Node {
    constructor(state, move = null, parent = null) {
        this.state = state;  // Current game state (board)
        this.move = move;    // Move made to reach this state
        this.parent = parent;
        this.children = [];
        this.visits = 0;
        this.wins = 0;
    }
}

// Helper functions for Tic Tac Toe
function getPossibleMoves(state) {
    return state.map((cell, index) => (cell === null ? index : null)).filter(index => index !== null);
}

function makeMove(state, move, player) {
    const newState = [...state];
    newState[move] = player;
    return newState;
}

function isTerminal(state) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]  // diagonals
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return state[a];  // Return winner
        }
    }
    return state.every(cell => cell !== null) ? 'draw' : false;
}

function getWinner(state) {
    const result = isTerminal(state);
    return result === 'X' ? 'win' : result === 'O' ? 'lose' : 'draw';
}

// function getRandomMove(moves) {
//     return moves[Math.floor(Math.random() * moves.length)];
// }

function evaluateBoard(state, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    let score = 0;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]  // diagonals
    ];

    winningCombinations.forEach(combo => {
        const [a, b, c] = combo;
        const cells = [state[a], state[b], state[c]];

        const playerCount = cells.filter(cell => cell === player).length;
        const opponentCount = cells.filter(cell => cell === opponent).length;

        if (playerCount === 3) {
            score += 100;
        } else if (playerCount === 2 && opponentCount === 0) {
            score += 10;
        } else if (playerCount === 1 && opponentCount === 0) {
            score += 1;
        }

        if (opponentCount === 3) {
            score -= 100;
        } else if (opponentCount === 2 && playerCount === 0) {
            score -= 10;
        } else if (opponentCount === 1 && playerCount === 0) {
            score -= 1;
        }
    });

    return score;
}

function getBestHeuristicMove(state, moves, player) {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let move of moves) {
        const newState = makeMove(state, move, player);
        const score = evaluateBoard(newState, player);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}

function select(node) {
    while (node.children.length > 0) {
        node = node.children.reduce((bestChild, child) => {
            const ucb1 = (child.wins / child.visits) + Math.sqrt(2 * Math.log(node.visits) / child.visits);
            return ucb1 > bestChild ? child : bestChild;
        }, node.children[0]);
    }
    return node;
}

function expand(node, player) {
    const possibleMoves = getPossibleMoves(node.state);
    possibleMoves.forEach(move => {
        const newState = makeMove(node.state, move, player);
        node.children.push(new Node(newState, move, node));
    });
}

function simulate(node, player) {
    let state = node.state;
    while (!isTerminal(state)) {
        const possibleMoves = getPossibleMoves(state);
        const move = getBestHeuristicMove(state, possibleMoves, player);
        state = makeMove(state, move, player);
        player = player === 'X' ? 'O' : 'X';
    }
    return getWinner(state);
}

function backpropagate(node, result) {
    while (node) {
        node.visits += 1;
        if (result === 'win') {
            node.wins += 1;
        }
        node = node.parent;
    }
}

function monteCarloTreeSearch(root, player, iterations = 5000) {  // Increase from 1000 to 5000 or more
    for (let i = 0; i < iterations; i++) {
        let node = select(root);
        if (!isTerminal(node.state)) {
            expand(node, player);
        }
        const result = simulate(node, player);
        backpropagate(node, result);
    }
    const bestMoveNode = root.children.reduce((bestChild, child) => child.visits > bestChild.visits ? child : bestChild, root.children[0]);
    return bestMoveNode.move;
}

module.exports = { Node, monteCarloTreeSearch };