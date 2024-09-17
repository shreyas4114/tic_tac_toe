import React, { useState, useEffect } from 'react';

const initialBoard = Array(9).fill(null);

function TicTacToe() {
    const [board, setBoard] = useState(initialBoard);
    const [isXNext, setIsXNext] = useState(true);
    const [status, setStatus] = useState("Next player: X");
    const [gameOver, setGameOver] = useState(false);

    // Effect to handle AI move
    useEffect(() => {
        if (!isXNext && !gameOver) {
            handleAIMove();
        }
    }, [isXNext, gameOver]); // Run effect on change of isXNext or gameOver

    const handleClick = (index) => {
        if (board[index] || gameOver) return;

        // Human player's move
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsXNext(false);

        // Check if the game is over after the human move
        if (isGameOver(newBoard)) return;
    };

    const handleAIMove = async () => {
        const bestMoveIndex = await getBestMove(board, 'O');
        if (bestMoveIndex !== undefined && bestMoveIndex !== null) {
            const newBoard = [...board];
            newBoard[bestMoveIndex] = 'O';
            setBoard(newBoard);
            setIsXNext(true); // Switch back to the human turn

            // Check if the game is over after AI move
            if (isGameOver(newBoard)) return;
        } else {
            console.error('AI failed to determine a valid move.');
        }

        
    };

    const getBestMove = async (boardState, player) => {
        try {
            const response = await fetch('http://localhost:5000/api/getBestMove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boardState, player }),
            });
            const data = await response.json();
            console.log('AI Move Index:', data.bestMove); // Debugging
            return data.bestMove;
        } catch (error) {
            console.error('Error fetching best move:', error);
            return null;
        }
    };

    const isGameOver = (currentBoard) => {
        const winner = calculateWinner(currentBoard);
        if (winner) {
            setStatus(`Winner: ${winner}`);
            setGameOver(true);
            return true;
        }
        if (currentBoard.every(cell => cell !== null)) {
            setStatus("It's a draw!");
            setGameOver(true);
            return true;
        }
        setStatus(`Next player: ${isXNext ? 'X' : 'O'}`);
        return false;
    };

    const calculateWinner = (board) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6],           // Diagonals
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const renderSquare = (index) => (
        <button className="square" onClick={() => handleClick(index)}>
            {board[index]}
        </button>
    );

    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

export default TicTacToe;
