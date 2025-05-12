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
*   Feedback mechanism for puzzle attempts.
*   Progress tracking within individual puzzles.
*   Success screen upon completing all challenges.
*   Clue generated from each puzzle that can help with the final challenge.
*   Puzzle is tricky and requires participants to discuss best approach.

## How to Play

1.  Open the `game.html` file in a web browser.
2.  Read the introductory message and click "Begin the Challenge!".
3.  Proceed through the puzzles sequentially. Each puzzle requires a specific action (answering questions, matching items, entering a code) to be solved.
4.  Follow the on-screen instructions for each puzzle. Feedback will be provided on your attempts.
5.  Successfully completing a puzzle will unlock the next section of the escape room.
6.  Each puzzle will start with an introductory page.
7.  Complete all five puzzles to reach the final success screen.

## Puzzles Overview

1.  **Biometric Code Entry:** Answer multiple-choice questions covering basic science and clinical trial concepts. The correct answers' first letters form a code needed for the final entry. Green lights track correct answers.
2.  **Protocol Matchup:** Match patient symptoms described in tiles to corresponding clinical trial protocols by clicking on them.
3.  **Data Dilemma:** Answer multiple-choice questions related to clinical data querying, Electronic Health Record (EHR) navigation (simulated), and adverse event grading (CTCAE).
4.  **Locked Storage:** Answer multiple-choice questions assessing your understanding of secure storage practices for clinical trial documents and data, referencing guidelines like GCP, FDA regulations (21 CFR), and HIPAA.
5.  **Final Challenge: Timed Emergency Response!:** Solve short limerick riddles describing critical clinical trial incidents. Enter keywords related to the correct emergency response actions within a 10 minute time limit.

## Technologies Used

*   HTML5
*   CSS3 (including Tailwind CSS framework)
*   JavaScript (Vanilla JS for game logic and DOM manipulation)

## File Structure

*   `game.html`: Contains the entire game structure, content, styles, and JavaScript logic within a single file.
*   `logo.png`: Image file used for the Yale logo 

## Credits

*   Game design and development: Design based on Kwasi Boatengs requirments for an interactive platform
*   Content derived from clinical trial and research concepts.
*   Uses Tailwind CSS and Inter font (via Google Fonts).

## License

[MIT]
