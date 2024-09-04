# 🎲 Sabelotodo
[RollDice](https://github.com/user-attachments/assets/9ff8d7ba-8b0d-4a32-b36e-dfadb5937cb2)

## 📖 Overview

Sabelotodo is a fun and interactive game where players move around a board by answering trivia questions from various categories based on software tecnologies. The goal is to answer questions from all categories correctly and reach the end of the board to win the game.

## 🚀 Features

- 🎮 Multiplayer gameplay
- ❓ Trivia questions from multiple software development categories
- 🎡 Roulette wheel for category selection
- 🏆 Winner determination based on correctly answered categories and board positions

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Node.js, Express.js, PostgreSQL
- **Styling:** CSS

## 📦 Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/MarcosPimienta/sabelotodo
    ```

2. **Navigate to the project directory:**

    ```bash
    cd sabelotodo
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

## 🕹️ Usage

1. **Start the development server:**

    ```bash
    npm start
    ```

2. **Open your browser and navigate to:**

    ```bash
    http://localhost:3000
    ```

## 🎮 Running the Game

Open the project in your browser at http://localhost:3000.
Follow the on-screen instructions to set up the game:
Select the number of players.
Enter player names and randomize the order.
Select the starting route for each player.
Start the game and take turns rolling the dice, answering questions, and moving your tokens on the board.

## 🎨 Customization
## 📝 Modifying Questions

Questions are stored in the `src/types/Question.ts` file. You can add or modify questions in the following categories:

Algorithms & Data Structures
Programming Languages
Web Development
Data Bases
DevOps & Dev Tools
UNIX System Terminal

1. **Example structure of a question:**

```
export const algorithms: Question[] = [
  {
    id: 1,
    category: 'Algorithms & Data Structures',
    question: 'What is a binary search?',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    difficulty: 'easy'
  },
  // Add more questions here
];
```

## 📍 Modifying Board Coordinates
Board coordinates are stored in the `src/types/BoardCoordinates.ts` file. You can modify the x and y values to change the positions of the player tokens on the board.

```
export const BoardCoordinates: { [key: string]: { x: number; y: number } } = {
  0: { x: 900, y: 370 },
  1: { x: 905, y: 365 },
  // Add more coordinates here
};
```

## ♟ Modifying Player Tokens
Player token colors and styles can be customized in the `src/styles/GameBoard.css` file. You can modify the CSS classes for different token colors.
```
.player-token.red {
  background-color: #C23334;
  border: solid 1px white;
}

.player-token.blue {
  background-color: #447DAB;
  border: solid 1px white;
}
```

## 🛠️ Modifying Game Mechanics
Game mechanics, such as the dice roll, player movement, and win conditions, are implemented in the src/components/GameBoard.tsx file. You can modify the logic in this file to change how the game works.

Example of modifying the dice roll logic:
```
const handleDiceRollComplete = (score: number) => {
  setDiceRoll(score);
};

const handleRollDice = () => {
  throwDice();
};
```

## 🤝 Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## 🙏 Acknowledgements
* Inspired by educational board games and quiz apps.
* Developed using React and TypeScript.

## 📧 Contact

For any questions or feedback, please reach out to [fenix3819@gmail.com](mailto:fenix3819@gmail.com).
