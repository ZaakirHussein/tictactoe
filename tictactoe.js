const gameBoxes = document.getElementsByClassName('grid-box');
let userPlayerOne;
let userPlayerTwo;

// Step 1: You’re going to store the gameboard as an array inside of a Gameboard object, so start there! (module)
const Gameboard = (function() {
    const boardArray = 
    ['', '', '', 
     '', '', '',
     '', '', ''];

    return { boardArray }
})();


// Step 2: Your players are also going to be stored in objects (factory function)
const PlayerFactory = (name, marker, turn, tally) => {
    return { name, marker, turn, tally }
};

// Step 3: Basically you want a module that takes care of printing to the display like, your browser it's only job should be to take information and output it in HTML
    // Don’t forget the logic that keeps players from playing in spots that are already taken!

// Step 4: Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage 
    // (for now you can just manually fill in the array with "X"s and "O"s)

const DisplayController = (function() {
    const createGrid = (() => {
        const gameGrid = document.querySelector('.grid');
        for (i = 0; i < 9; i++) {
            let cell = document.createElement("div");
            cell.id = i;
            gameGrid.appendChild(cell).className = "grid-box";
        }
    })(); ;

    const displayMarker = () => {
        for (i = 0; i < gameBoxes.length; i++) {
            gameBoxes.textContent =  Gameboard.boardArray[gameBoxes.id]
        }
        Array.from(gameBoxes).forEach(gameBox => {
            gameBox.textContent = Gameboard.boardArray[gameBox.id];
        });
    };
    displayMarker();

    return { 
        updateDisplay: function () {
        displayMarker(); 
        }
    }
})();

// This module is repsonsibile for storing the form's inputs which will be used in the creation of player and with name displays.
    // Additionally, it closes the popup form after user presses submit

const FormInput = (() => {
    const submitForm = document.querySelector('.popup-form');
    const closeForm = () => {
        document.querySelector('.form-container').style.display = 'none';
        document.querySelector('#overlay').style.display = 'none';
        submitForm.reset();
    };

    const formOutput = (event) => {
        event.preventDefault();
        //Player Creation
        const playerOneInput = document.getElementById('userone-name').value;
        const playerTwoInput = document.getElementById('usertwo-name').value;
        userPlayerOne = PlayerFactory(playerOneInput, 'X', true, 0);
        userPlayerTwo = PlayerFactory(playerTwoInput, 'O', false, 0);
        closeForm();
        gameFlow();
    }; 

    submitForm.addEventListener('submit', formOutput)

})();



// Step 6: You’re probably going to want an object to control the flow of the game itself. (module)

const gameFlow = function () {
    const playRound = (() => {
        // User Score Display
        const userOneScore = document.getElementById('user1-score');
        const userTwoScore =  document.getElementById('user2-score');
        // Winner Display
        const winnerText = document.querySelector('.question');
        // Tie Function
        const tieCounter = document.getElementById('tie-score');
        let tie = 0;
        let win = false;
        
        // Name display function
        const nameDisplay = (() => {
            const userOneName = document.getElementById('display-name1');
            const userTwoName = document.getElementById('display-name2');
            userOneName.textContent =  `${userPlayerOne.name}\'s Score (${userPlayerOne.marker})`
            userTwoName.textContent = `${userPlayerTwo.name}\'s Score (${userPlayerTwo.marker})`;
            return { userOneName, userTwoName }
        })();

        // Here I place the active marker in the 'clicked' box's array index.
            // Essentially this is the internal logic that the DisplayController module displays. 
        const addMarkerToArr = ((event) => {
            let currentVal = Gameboard.boardArray[`${event.target.id}`];
            console.log(`The box's current value is: ${currentVal}`);
        
            if (userPlayerOne.turn == true && currentVal === '') {
                Gameboard.boardArray[`${event.target.id}`] = userPlayerOne.marker;
                userPlayerOne.turn = false;
                userPlayerTwo.turn = true;
                DisplayController.updateDisplay();
                console.log(Gameboard.boardArray);
                checkWinner();
                checkTie();
            } else if (userPlayerTwo.turn === true && currentVal === '') {
                    Gameboard.boardArray[`${event.target.id}`] = userPlayerTwo.marker;
                    userPlayerTwo.turn = false;
                    userPlayerOne.turn = true;
                    DisplayController.updateDisplay();
                    console.log(Gameboard.boardArray);
                    checkWinner();
                    checkTie();
                }
        });
        const addClickFunc = () => {
            Array.from(gameBoxes).forEach(item => {
                item.addEventListener('click', addMarkerToArr)
            })
        };
        addClickFunc();

        const checkWinner = () => {
            // Needed for refactoring later
            const winCombo = [
                // Row
                [0, 1, 2], [3, 4, 5], [6, 7, 8], 
                // Column
                [0, 3, 6], [1, 4, 7], [2, 5, 8], 
                //Diagonal
                [2, 4, 6], [0, 4, 8]
                ];

            if (Gameboard.boardArray[0] === userPlayerOne.marker  && Gameboard.boardArray[1] === userPlayerOne.marker && Gameboard.boardArray[2] === userPlayerOne.marker
                        || Gameboard.boardArray[3] === userPlayerOne.marker  && Gameboard.boardArray[4] === userPlayerOne.marker && Gameboard.boardArray[5] === userPlayerOne.marker 
                        || Gameboard.boardArray[6] === userPlayerOne.marker  && Gameboard.boardArray[7] === userPlayerOne.marker && Gameboard.boardArray[8] === userPlayerOne.marker 
                        || Gameboard.boardArray[0] === userPlayerOne.marker  && Gameboard.boardArray[3] === userPlayerOne.marker && Gameboard.boardArray[6] === userPlayerOne.marker 
                        || Gameboard.boardArray[1] === userPlayerOne.marker  && Gameboard.boardArray[4] === userPlayerOne.marker && Gameboard.boardArray[7] === userPlayerOne.marker
                        || Gameboard.boardArray[2] === userPlayerOne.marker  && Gameboard.boardArray[5] === userPlayerOne.marker && Gameboard.boardArray[8] === userPlayerOne.marker
                        || Gameboard.boardArray[2] === userPlayerOne.marker  && Gameboard.boardArray[4] === userPlayerOne.marker && Gameboard.boardArray[6] === userPlayerOne.marker
                        || Gameboard.boardArray[0] === userPlayerOne.marker  && Gameboard.boardArray[4] === userPlayerOne.marker && Gameboard.boardArray[8] === userPlayerOne.marker) {
                            userPlayerOne.tally++;
                            userOneScore.textContent = userPlayerOne.tally;
                            win = true;
                            winnerText.textContent = `${userPlayerOne.name} won this round!`
                            endGame();
                            // function that prevents clicking
                            return console.log('player 1 won')
                } else if (Gameboard.boardArray[0] === userPlayerTwo.marker  && Gameboard.boardArray[1] === userPlayerTwo.marker && Gameboard.boardArray[2] === userPlayerTwo.marker
                            || Gameboard.boardArray[3] === userPlayerTwo.marker  && Gameboard.boardArray[4] === userPlayerTwo.marker && Gameboard.boardArray[5] === userPlayerTwo.marker 
                            || Gameboard.boardArray[6] === userPlayerTwo.marker  && Gameboard.boardArray[7] === userPlayerTwo.marker && Gameboard.boardArray[8] === userPlayerTwo.marker 
                            || Gameboard.boardArray[0] === userPlayerTwo.marker  && Gameboard.boardArray[3] === userPlayerTwo.marker && Gameboard.boardArray[6] === userPlayerTwo.marker 
                            || Gameboard.boardArray[1] === userPlayerTwo.marker  && Gameboard.boardArray[4] === userPlayerTwo.marker && Gameboard.boardArray[7] === userPlayerTwo.marker
                            || Gameboard.boardArray[2] === userPlayerTwo.marker  && Gameboard.boardArray[5] === userPlayerTwo.marker && Gameboard.boardArray[8] === userPlayerTwo.marker
                            || Gameboard.boardArray[2] === userPlayerTwo.marker  && Gameboard.boardArray[4] === userPlayerTwo.marker && Gameboard.boardArray[6] === userPlayerTwo.marker
                            || Gameboard.boardArray[0] === userPlayerTwo.marker  && Gameboard.boardArray[4] === userPlayerTwo.marker && Gameboard.boardArray[8] === userPlayerTwo.marker) {
                            userPlayerTwo.tally++;
                            userTwoScore.textContent = userPlayerTwo.tally;
                            win = true;
                            winnerText.textContent = `${userPlayerTwo.name} won this round!`
                            endGame();
                            // function that prevents clicking

                            return console.log('player 2 won')
                        }          
        };

        const checkTie = () => {
            const tieCondition = !Gameboard.boardArray.includes('');
            if (tieCondition && win === false ) {
                tie++;
                tieCounter.textContent = tie;
                endGame();
                return console.log('it was a tie')
            }
        };

        const endGame = () => {
            Array.from(gameBoxes).forEach(item => {
                item.removeEventListener('click', addMarkerToArr)
            })

            Gameboard.boardArray = ['', '', '', '', '', '', '', '', ''];               
            console.log('game ended')
        }

        const newRound = (() => {
            const resetRoundBtn = document.getElementById('start-btn');
            resetRoundBtn.addEventListener('click', () => {
                Gameboard.boardArray = ['', '', '', '', '', '', '', '', ''];     
                DisplayController.updateDisplay();
                win = false;
                winnerText.textContent = 'Let\'s have a friendly old game of Tic Tac Toe!'
                addClickFunc();
            })
        })();

        
        const resetScore = (() => {
            const resetScoreBtn = document.getElementById('restart-btn');
            resetScoreBtn.addEventListener('click', () => {
                Gameboard.boardArray = ['', '', '', '', '', '', '', '', ''];
                userPlayerOne.tally = 0;
                userPlayerTwo.tally = 0;
                userOneScore.textContent = userPlayerOne.tally;
                userTwoScore.textContent = userPlayerTwo.tally;
                tie = 0;
                tieCounter.textContent = tie;       
                DisplayController.updateDisplay();
                win = false;
                winnerText.textContent = 'Let\'s have a friendly old game of Tic Tac Toe!'
                addClickFunc();
            })
        })();

    })();
};




