# Yale Clinical Trials - Virtual Escape Room: The Decker Protein Discovery Challenge

## Overview

This project is a virtual escape room designed to challenge participants' knowledge of clinical trial protocols, data handling, and research best practices within the context of a fictional "Decker Protein" clinical trial at Yale. Players must solve a series of puzzles to unlock access to critical information and successfully complete the mission.

## Game Description

You are a researcher tasked with fast-tracking the revolutionary "Decker Protein" clinical trial at Yale. To prove your team's expertise and gain access to the necessary data and resources, you must navigate through a series of challenges simulating real-world clinical research scenarios. Each solved puzzle unlocks the next, testing your knowledge and problem-solving skills under pressure.

## Features

*   Interactive multi-puzzle format.
*   Challenges covering:
    *   Biometric code entry via knowledge questions.
    *   Matching patient symptoms to clinical trial protocols.
    *   Answering questions about clinical data handling and EHR navigation.
    *   Testing knowledge of secure storage protocols (GCP, FDA, HIPAA).
    *   A timed emergency response challenge involving solving limerick puzzles.
*   Interactive clue discovery elements in each puzzle.
*   Feedback mechanism for puzzle attempts.
*   Progress tracking within individual puzzles.
*   Timed challenge at the end.
*   Success screen upon completing all challenges.
*   Post-completion survey for user feedback.

## How to Play

1.  Click the link to open the game.
2.  Read the introductory message and click "Begin the Challenge!".
3.  Proceed through the puzzles sequentially. Each puzzle requires a specific action (answering questions, matching items, entering a code) to be solved.
4.  Follow the on-screen instructions for each puzzle. Feedback will be provided on your attempts.
5.  After completing each puzzle, explore the environment to discover clues for the final challenge.
6.  Successfully completing all five puzzles will unlock the success screen and a feedback survey.

## Puzzles Overview

1.  **Biometric Code Entry:** Answer multiple-choice questions covering basic science and clinical trial concepts. The correct answers' first letters form a code needed for the final entry. Green lights track correct answers. After completion, find research notes for a clue to the final challenge.

2.  **Protocol Matchup:** Match patient symptoms described in tiles to corresponding clinical trial protocols by clicking on them. After completion, open a storage cabinet to discover another clue.

3.  **Data Dilemma:** Answer multiple-choice questions related to clinical data querying, Electronic Health Record (EHR) navigation, and adverse event grading (CTCAE). After completion, check a notification message for another clue.

4.  **Locked Storage:** Answer multiple-choice questions assessing your understanding of secure storage practices for clinical trial documents and data, referencing guidelines like GCP, FDA regulations (21 CFR), and HIPAA. After completion, investigate a security alert for another clue.

5.  **Final Challenge: Timed Emergency Response!:** Solve short limerick riddles describing critical clinical trial incidents within an 8-minute time limit. Enter keywords related to the correct emergency response actions to complete the challenge and escape.

## Technologies Used

*   HTML5
*   CSS3 (including Tailwind CSS via CDN)
*   JavaScript (Vanilla JS for game logic and DOM manipulation)
*   Google Fonts (Inter font)

## File Structure

*   `index.html`: Contains the main game structure and HTML content.
*   `script.js`: Contains all game logic, puzzle content, and interactive functionality.
*   `styles.css`: Contains additional custom styling beyond Tailwind CSS.
*   `logo.png`: Image file used for the Yale logo.
*   `answer_key.md`: Contains reference solutions and explanations (for administrators).

## Credits

*   Game design and development: Design based on Kwasi Boateng's requirements for an interactive platform
*   Content derived from clinical trial and research concepts.
*   Uses Tailwind CSS and Inter font (via Google Fonts).

## License

[MIT]
