// --- Global State & Configuration ---
let currentPuzzle = 0; // 0: Intro, 1: Biometric, 2: Protocol, etc.
const puzzles = [
    'intro-section', 
    'puzzle1-biometric', 
    'puzzle2-protocol', 
    'puzzle3-data', 
    'puzzle4-storage', 
    'puzzle5-limericks',
    'success-section',
    'failure-section',
    'survey-section'
];

function showPuzzle(puzzleId) {
    // If going back to intro, reset all puzzle states
    if (puzzleId === 'intro-section') {
        // Reset Puzzle 1
        p1CurrentQuestionIndex = 0;
        p1CorrectAnswers = 0;
        p1UserAnswers = Array(p1Questions.length).fill(null);
        p1AnsweredQuestions = Array(p1Questions.length).fill(false);
        document.querySelectorAll('[id^="p1-light-"]').forEach(light => light.classList.remove('on'));
        
        // Reset Puzzle 2
        p2SelectedSymptom = null;
        p2SelectedProtocol = null;
        p2MatchedPairs = 0;
        
        // Reset Puzzle 5 timer
        clearInterval(p5TimerInterval);
        p5TimeRemaining = 8 * 60;

        // Hide all post-completion areas and reset clue states
        document.getElementById('p1-post-completion-area').classList.add('hidden');
        document.getElementById('p1-revealed-clue').classList.add('hidden');
        document.getElementById('p1-find-clue-button').classList.remove('hidden');
        
        document.getElementById('p2-post-completion-area').classList.add('hidden');
        document.getElementById('p2-revealed-clue').classList.add('hidden');
        document.getElementById('p2-find-clue-button').classList.remove('hidden');
        
        document.getElementById('p3-post-completion-area').classList.add('hidden');
        document.getElementById('p3-revealed-clue').classList.add('hidden');
        document.getElementById('p3-find-clue-button').classList.remove('hidden');
        
        document.getElementById('p4-post-completion-area').classList.add('hidden');
        document.getElementById('p4-revealed-clue').classList.add('hidden');
        document.getElementById('p4-find-clue-button').classList.remove('hidden');
    }
    
    puzzles.forEach(id => {
        const el = document.getElementById(id);
        if (id === puzzleId) {
            el.classList.remove('hidden');
            el.classList.add('visible');
            
            // Start timer only when puzzle 5 becomes visible
            if (id === 'puzzle5-limericks') {
                // Reset and start the timer for puzzle 5
                p5TimeRemaining = 8 * 60; // Reset to 8 minutes
                startP5Timer();
            }
        } else {
            el.classList.remove('visible');
            el.classList.add('hidden');
            
            // Clear timer if leaving puzzle 5
            if (id === 'puzzle5-limericks') {
                clearInterval(p5TimerInterval);
            }
        }
    });
}

// --- Puzzle 1: Biometric Code Entry ---
const p1Questions = [
    {
        question: "What is the primary type of nucleic acid often depicted as a 'double helix' that carries genetic instructions for all known living organisms?",
        options: { 
            a: "DNA Replication Complex", 
            b: "Deoxyribonucleic Acid (DNA)", 
            c: "Nucleic Acid Polymer", 
            d: "Ribosomal Nucleic Structure" 
        },
        correctAnswer: "b",
        answerLetter: "D"
    },
    {
        question: "In a clinical trial, what is the term for the specific, measurable outcome the study is designed to assess?",
        options: { 
            a: "Primary Outcome", 
            b: "Trial Objective", 
            c: "Endpoint", 
            d: "Efficacy Measure" 
        },
        correctAnswer: "c",
        answerLetter: "E"
    },
    {
        question: "Which of the four main nucleobases in DNA forms three hydrogen bonds and always pairs with guanine?",
        options: { 
            a: "Thymine", 
            b: "Cytosine", 
            c: "Complementary Base", 
            d: "Adenine Analog" 
        },
        correctAnswer: "b",
        answerLetter: "C"
    },
    {
        question: "What absolute temperature scale begins at absolute zero (-273.15°C) and is commonly used in scientific research?",
        options: { 
            a: "Absolute Scale", 
            b: "Kelvin", 
            c: "Zero-point Measurement", 
            d: "Kelvin-based Units" 
        },
        correctAnswer: "b",
        answerLetter: "K"
    },
    {
        question: "What critical process in clinical research involves thorough assessment and judgment of an intervention's effects, value, and quality?",
        options: { 
            a: "Data Analysis", 
            b: "Quality Assessment", 
            c: "Evaluation", 
            d: "Efficacy Review" 
        },
        correctAnswer: "c",
        answerLetter: "E"
    },
    {
        question: "What type of nucleic acid molecule is essential in protein synthesis, carrying the genetic code from DNA to the ribosome?",
        options: { 
            a: "Molecular Translator", 
            b: "Genetic Messenger", 
            c: "Ribonucleic Acid (RNA)", 
            d: "RNA Molecule" 
        },
        correctAnswer: "c",
        answerLetter: "R"
    }
];

let p1CurrentQuestionIndex = 0;
let p1CorrectAnswers = 0;
let p1UserAnswers = Array(p1Questions.length).fill(null);
let p1AnsweredQuestions = Array(p1Questions.length).fill(false);
const p1QuestionsContainer = document.getElementById('p1-questions-container');
const p1Feedback = document.getElementById('p1-feedback');
const p1FinalCodeEntry = document.getElementById('p1-final-code-entry');
const p1CodeInput = document.getElementById('p1-code-input');
const p1SubmitCodeButton = document.getElementById('p1-submit-code');
const p1FinalFeedback = document.getElementById('p1-final-feedback');
const p1HintButton = document.getElementById('p1-hint-button');
const p1HintText = document.getElementById('p1-hint-text');

function loadP1Question(questionIndex = null) {
    // If questionIndex is provided, load that specific question
    if (questionIndex !== null) {
        p1CurrentQuestionIndex = questionIndex;
    }
    
    p1Feedback.textContent = '';
    p1Feedback.className = 'feedback-message mt-4';
    
    if (p1CurrentQuestionIndex < p1Questions.length) {
        const q = p1Questions[p1CurrentQuestionIndex];
        p1QuestionsContainer.innerHTML = `
            <div class="question-card">
                <p class="font-medium mb-3">Question ${p1CurrentQuestionIndex + 1} of ${p1Questions.length}: ${q.question}</p>
                ${Object.entries(q.options).map(([key, value]) => `
                    <button class="option-button ${p1UserAnswers[p1CurrentQuestionIndex] === key ? (key === q.correctAnswer ? 'correct' : 'incorrect') : ''}" data-answer="${key}">
                        ${key.toUpperCase()}. ${value}
                    </button>
                `).join('')}
            </div>
            <div class="flex justify-between mt-4">
                ${p1CurrentQuestionIndex > 0 ? '<button id="p1-prev-question" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Previous</button>' : '<div></div>'}
                <button id="p1-next-question" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    ${p1CurrentQuestionIndex < p1Questions.length - 1 ? 'Next' : 'Finish'}
                </button>
            </div>
        `;
        
        // Show correct answer for previously answered questions
        if (p1AnsweredQuestions[p1CurrentQuestionIndex]) {
            const correctAnswerKey = q.correctAnswer;
            p1QuestionsContainer.querySelector(`.option-button[data-answer="${correctAnswerKey}"]`).classList.add('correct');
        }
        
        p1QuestionsContainer.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', handleP1Answer);
        });
        
        if (p1CurrentQuestionIndex > 0) {
            document.getElementById('p1-prev-question').addEventListener('click', () => {
                loadP1Question(p1CurrentQuestionIndex - 1);
            });
        }
        
        document.getElementById('p1-next-question').addEventListener('click', () => {
            if (p1CurrentQuestionIndex < p1Questions.length - 1) {
                loadP1Question(p1CurrentQuestionIndex + 1);
            } else {
                checkAllAnswersAndFinish();
            }
        });
    } else {
        checkAllAnswersAndFinish();
    }
}

function handleP1Answer(event) {
    const selectedAnswer = event.target.dataset.answer;
    const questionData = p1Questions[p1CurrentQuestionIndex];
    
    // Store the user's answer
    p1UserAnswers[p1CurrentQuestionIndex] = selectedAnswer;
    p1AnsweredQuestions[p1CurrentQuestionIndex] = true;
    
    // Remove previous highlighting
    p1QuestionsContainer.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
    });
    
    // Highlight selected answer
    if (selectedAnswer === questionData.correctAnswer) {
        event.target.classList.add('correct');
        p1Feedback.textContent = 'Correct! Excellent work.';
        p1Feedback.className = 'feedback-message mt-4 feedback-correct';
        
        // If this is the first time getting this question correct
        if (!document.getElementById(`p1-light-${p1CurrentQuestionIndex}`).classList.contains('on')) {
            document.getElementById(`p1-light-${p1CurrentQuestionIndex}`).classList.add('on');
            p1CorrectAnswers++;
        }
    } else {
        event.target.classList.add('incorrect');
        p1Feedback.textContent = 'Incorrect. The correct answer has been highlighted.';
        p1Feedback.className = 'feedback-message mt-4 feedback-incorrect';
        
        // Also highlight the correct answer
        p1QuestionsContainer.querySelector(`.option-button[data-answer="${questionData.correctAnswer}"]`).classList.add('correct');
    }
    
    // Don't automatically advance - let user control navigation
}

function checkAllAnswersAndFinish() {
    // Check if all questions have been answered
    const allAnswered = p1AnsweredQuestions.every(answered => answered);
    
    if (!allAnswered) {
        p1Feedback.textContent = 'Please answer all questions before proceeding.';
        p1Feedback.className = 'feedback-message mt-4 feedback-incorrect';
        
        // Find the first unanswered question and go to it
        const firstUnansweredIndex = p1AnsweredQuestions.findIndex(answered => !answered);
        if (firstUnansweredIndex !== -1) {
            loadP1Question(firstUnansweredIndex);
        }
        return;
    }
    
    // Show the final code entry form
    p1QuestionsContainer.innerHTML = `
        <p class="text-center font-semibold ${p1CorrectAnswers === p1Questions.length ? 'text-green-600' : 'text-yellow-600'}">
            All questions answered! You got ${p1CorrectAnswers} out of ${p1Questions.length} correct.
        </p>
        <button id="p1-review-answers" class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
            Review Answers
        </button>
    `;
    
    document.getElementById('p1-review-answers').addEventListener('click', () => {
        loadP1Question(0);
    });
    
    p1FinalCodeEntry.classList.remove('hidden');
}

p1HintButton.addEventListener('click', () => {
    p1HintText.classList.remove('hidden');
});

p1SubmitCodeButton.addEventListener('click', () => {
    const enteredCode = p1CodeInput.value.toUpperCase();
    if (enteredCode === "DECKER") {
        if (p1CorrectAnswers === 6) {
             p1FinalFeedback.textContent = 'Access Granted! The Decker Protein Database is unlocked.';
             p1FinalFeedback.className = 'feedback-message mt-2 text-center feedback-correct';
             
             // Show the post-completion area instead of directly displaying a clue
             document.getElementById('p1-post-completion-area').classList.remove('hidden');
        } else {
             p1FinalFeedback.textContent = 'Code correct, but you missed some questions. Review your notes! For now, we grant access.';
             p1FinalFeedback.className = 'feedback-message mt-2 text-center feedback-correct'; // Still correct code
             
             // Still show the post-completion area
             document.getElementById('p1-post-completion-area').classList.remove('hidden');
        }
    } else {
        p1FinalFeedback.textContent = 'Access Denied. Incorrect code. Please re-check the first letters of the correct answers.';
        p1FinalFeedback.className = 'feedback-message mt-2 text-center feedback-incorrect';
        p1CodeInput.value = ''; // Clear input
    }
});

// Add event listeners for the new clue discovery buttons
document.getElementById('p1-find-clue-button').addEventListener('click', () => {
    // Reveal the clue when the button is clicked
    document.getElementById('p1-revealed-clue').classList.remove('hidden');
    document.getElementById('p1-find-clue-button').classList.add('hidden');
});

document.getElementById('p1-continue-button').addEventListener('click', () => {
    showPuzzle('puzzle2-protocol');
});

// --- Puzzle 2: Protocol Matchup ---
const p2Symptoms = [
    { id: 's1', text: "Persistent, severe throbbing headache, aura, photophobia, 3-4 times/month." }, // Migraine
    { id: 's2', text: "Adult: fasting blood glucose 135 mg/dL, HbA1c 7.2%." }, // Diabetes
    { id: 's3', text: "Elderly: memory lapses, difficulty with familiar tasks, confusion." }, // Alzheimer's
    { id: 's4', text: "Young adult: persistent sadness, loss of interest, fatigue, poor concentration >6 weeks." }, // Depression
    { id: 's5', text: "Known asthma: increased wheezing, SOB, nighttime awakenings despite inhaler." }, // Asthma
    { id: 's6', text: "Sudden severe joint pain, swelling, redness, especially big toe." }, // Gout
    { id: 's7', text: "Recurrent, itchy, raised red welts on skin; no consistent trigger." }, // Urticaria
    { id: 's8', text: "Middle-aged adult: episodic chest pain, worsens with exercise, resolves with rest." }, // Angina
    { id: 's9', text: "Older adult: progressive joint stiffness, pain, reduced mobility in knees and hips." }, // Osteoarthritis
    { id: 's10', text: "Young female: heavy menstrual bleeding, abdominal pain, uterine fibroids on imaging." } // Uterine Fibroids
];

const p2Protocols = [
    { id: 'pA', text: "YNH-NeuroCognitive-004B: CogniBoost for early-stage Alzheimer's." },
    { id: 'pB', text: "YaleResp-AC-221: FluticasoneMax for severe asthma." },
    { id: 'pC', text: "ElmCity-Endo-T2DM-R01: Metformin XR Plus Glucostat for Type 2 Diabetes." },
    { id: 'pD', text: "YSPsyche-MDD-009: Escitalopram vs. Serenitude for Major Depressive Disorder." },
    { id: 'pE', text: "Skull&Bones-PainFree-MGR01: Topiramate-NG for chronic migraine." },
    { id: 'pF', text: "SterlingRheum-GU-007: Colchicine-Neo for Gout flares." },
    { id: 'pG', text: "YaleDerm-CU-PatchIt: Topical immunomodulator for chronic urticaria." },
    { id: 'pH', text: "Yale-Cardio-IHD-005: CardioStent Plus for stable angina pectoris." },
    { id: 'pI', text: "OrthoJoint-OA-Yale-021: Hyaluronate-Advanced for moderate osteoarthritis." },
    { id: 'pJ', text: "Yale-GYN-UFib-008: UltraFocus therapy for symptomatic uterine fibroids." }
];

const p2CorrectMatches = { s1: 'pE', s2: 'pC', s3: 'pA', s4: 'pD', s5: 'pB', s6: 'pF', s7: 'pG', s8: 'pH', s9: 'pI', s10: 'pJ' };
let p2SelectedSymptom = null;
let p2SelectedProtocol = null;
let p2MatchedPairs = 0;

const p2SymptomsColumn = document.getElementById('p2-symptoms-column');
const p2ProtocolsColumn = document.getElementById('p2-protocols-column');
const p2FeedbackEl = document.getElementById('p2-feedback');
const p2NextButton = document.getElementById('p2-next-puzzle');

function shuffleArray(array) { // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadP2Tiles() {
    shuffleArray(p2Symptoms); // Shuffle for replayability
    shuffleArray(p2Protocols);

    p2SymptomsColumn.innerHTML = '<h3 class="text-lg font-medium yale-blue-text mb-2 text-center">Symptoms</h3>';
    p2ProtocolsColumn.innerHTML = '<h3 class="text-lg font-medium yale-blue-text mb-2 text-center">Protocols</h3>';

    p2Symptoms.forEach(symptom => {
        const tile = document.createElement('div');
        tile.classList.add('tile', 'symptom-tile');
        tile.dataset.id = symptom.id;
        tile.textContent = symptom.text;
        tile.addEventListener('click', () => handleP2SymptomSelect(tile));
        p2SymptomsColumn.appendChild(tile);
    });

    p2Protocols.forEach(protocol => {
        const tile = document.createElement('div');
        tile.classList.add('tile', 'protocol-tile');
        tile.dataset.id = protocol.id;
        tile.textContent = protocol.text;
        tile.addEventListener('click', () => handleP2ProtocolSelect(tile));
        p2ProtocolsColumn.appendChild(tile);
    });
    p2MatchedPairs = 0; // Reset count
    p2NextButton.classList.add('hidden');
    p2FeedbackEl.textContent = '';
}

function handleP2SymptomSelect(tile) {
    if (tile.classList.contains('matched')) return;
    if (p2SelectedSymptom) p2SelectedSymptom.classList.remove('selected');
    p2SelectedSymptom = tile;
    tile.classList.add('selected');
    checkP2Match();
}

function handleP2ProtocolSelect(tile) {
    if (tile.classList.contains('matched')) return;
    if (p2SelectedProtocol) p2SelectedProtocol.classList.remove('selected');
    p2SelectedProtocol = tile;
    tile.classList.add('selected');
    checkP2Match();
}

function checkP2Match() {
    if (p2SelectedSymptom && p2SelectedProtocol) {
        const symptomId = p2SelectedSymptom.dataset.id;
        const protocolId = p2SelectedProtocol.dataset.id;

        if (p2CorrectMatches[symptomId] === protocolId) {
            p2SelectedSymptom.classList.add('matched');
            p2SelectedProtocol.classList.add('matched');
            p2SelectedSymptom.classList.remove('selected');
            p2SelectedProtocol.classList.remove('selected');
            p2FeedbackEl.textContent = 'Correct Match!';
            p2FeedbackEl.className = 'feedback-message mt-6 text-center feedback-correct';
            p2MatchedPairs++;
            if (p2MatchedPairs === p2Symptoms.length) {
                p2FeedbackEl.textContent = 'All protocols matched correctly! Outstanding work!';
                p2NextButton.classList.remove('hidden');
            }
        } else {
            p2FeedbackEl.textContent = 'Incorrect match. Try again.';
            p2FeedbackEl.className = 'feedback-message mt-6 text-center feedback-incorrect';
            p2SelectedSymptom.classList.remove('selected');
            p2SelectedProtocol.classList.remove('selected');
        }
        p2SelectedSymptom = null;
        p2SelectedProtocol = null;
        setTimeout(() => { if(p2MatchedPairs !== p2Symptoms.length) {p2FeedbackEl.textContent = ''; p2FeedbackEl.className = 'feedback-message mt-6 text-center';}}, 1500);
    }
}

p2NextButton.addEventListener('click', () => {
    // Hide the next button to prevent duplicate clicks
    p2NextButton.classList.add('hidden');
    
    // Show the post-completion area instead of directly displaying a clue
    document.getElementById('p2-post-completion-area').classList.remove('hidden');
});

// Add event listeners for the new clue discovery buttons in Puzzle 2
document.getElementById('p2-find-clue-button').addEventListener('click', () => {
    // Reveal the clue when the button is clicked
    document.getElementById('p2-revealed-clue').classList.remove('hidden');
    document.getElementById('p2-find-clue-button').classList.add('hidden');
});

document.getElementById('p2-continue-button').addEventListener('click', () => {
    showPuzzle('puzzle3-data');
});

// --- Puzzle 3: Data Dilemma ---
const p3Questions = [
    {
        question: "A patient in your trial reports 'feeling really off and woozy all morning.' According to CTCAE v5, if this is determined to be 'Dizziness' and it's limiting their instrumental Activities of Daily Living (ADLs) like driving or shopping, what is the correct grade?",
        options: { a: "Grade 1 (Mild)", b: "Grade 2 (Moderate; limiting instrumental ADL)", c: "Grade 3 (Severe; limiting self-care ADL)", d: "Grade 'My Head is Spinning Like a Top'" },
        correctAnswer: "b"
    },
    {
        question: "To confirm a patient's official cancer diagnosis for trial eligibility, you need to find the definitive pathology report. In a typical EPIC system, which major menu or activity would you most likely navigate to first?",
        options: { a: "Billing and Insurance", b: "Social Work Notes", c: "Chart Review (then likely a 'Media' or 'Pathology/Labs' tab)", d: "The Cafeteria Menu (to ponder over coffee)" },
        correctAnswer: "c"
    },
    {
        question: "You need to verify the exact start time, stop time, and total volume infused for an investigational product administered yesterday. Which section in EPIC would provide the most accurate and contemporaneous record of these administration details?",
        options: { a: "The patient's handwritten diary", b: "MAR (Medication Administration Record) or an Infusion Flowsheet/Documentation section", c: "A sticky note left by the previous shift", d: "The 'Doctor's Best Guess' tab" },
        correctAnswer: "b"
    },
    {
        question: "A patient's reported medical history includes 'heart racing really fast sometimes.' If the physician confirms this as 'Paroxysmal Atrial Tachycardia,' and the protocol requires reporting any cardiac arrhythmias, which term should be officially recorded?",
        options: { a: "'Heart going boom-boom-boom'", b: "'Occasional Speedy Heart Syndrome'", c: "Paroxysmal Atrial Tachycardia", d: "'Needs more calming tea'" },
        correctAnswer: "c"
    },
    {
        question: "You're reviewing lab results for a patient in your trial. Per the protocol, ALT >3x ULN requires immediate notification. If a patient's ALT is 120 U/L and the lab's ULN is 41 U/L, what action is needed?",
        options: { a: "No action needed, this is within normal limits", b: "Note in the file for future reference only", c: "Immediate notification as specified by protocol", d: "Wait for next lab draw to confirm trend" },
        correctAnswer: "c"
    },
    {
        question: "A physician documents 'moderate fatigue limiting some daily activities' in the progress note. When entering this in the EDC system according to CTCAE v5, what grade should be assigned to fatigue?",
        options: { a: "Grade 1", b: "Grade 2", c: "Grade 3", d: "Grade 4" },
        correctAnswer: "b"
    },
    {
        question: "You notice a discrepancy between what a patient verbally reported about medication adherence and what's documented in their pill count log. What is the most appropriate next step?",
        options: { a: "Ignore the discrepancy; verbal reports are always more accurate", b: "Document the discrepancy and discuss with the patient to understand the reason", c: "Automatically use the pill count data and ignore the verbal report", d: "Delete one of the conflicting data points to resolve the discrepancy" },
        correctAnswer: "b"
    },
    {
        question: "A protocol requires monitoring of QTc intervals on ECGs. The most recent ECG report shows a QTc of 481ms, but the previous one was 452ms. According to most clinical trial protocols, this would typically be considered:",
        options: { a: "A normal variation requiring no action", b: "A potentially clinically significant increase requiring follow-up", c: "Grounds for immediate study drug discontinuation in all cases", d: "A transcription error since QTc can't change that much" },
        correctAnswer: "b"
    },
    {
        question: "When documenting concomitant medications in a clinical trial database, which of the following is the most appropriate way to record a patient taking 'Tylenol as needed for headaches'?",
        options: { a: "Skip it; over-the-counter medications don't need to be recorded", b: "Record 'Tylenol' with 'PRN' or 'as needed' in the frequency field and 'headache' as indication", c: "Just write 'patient self-medicates' in the comments", d: "Record it as 'analgesic therapy' without specifying the exact medication" },
        correctAnswer: "b"
    },
    {
        question: "A patient experiences sudden shortness of breath during study drug infusion, which resolves when the infusion is slowed. When entering this event in the EDC, the most accurate classification would be:",
        options: { a: "An unrelated adverse event", b: "A potential infusion reaction that may be related to study drug", c: "A pre-existing condition", d: "A documentation error that doesn't need reporting" },
        correctAnswer: "b"
    }
];
const p3QuestionsContainer = document.getElementById('p3-questions-container');
const p3SubmitButton = document.getElementById('p3-submit-answers');
const p3FeedbackOverall = document.getElementById('p3-feedback-overall');
const p3NextPuzzleButton = document.getElementById('p3-next-puzzle');
let p3Answers = {};

function loadP3Questions() {
    p3QuestionsContainer.innerHTML = '';
    p3Questions.forEach((q, index) => {
        const questionEl = document.createElement('div');
        questionEl.classList.add('question-card');
        questionEl.innerHTML = `
            <p class="font-medium mb-3">${index + 1}. ${q.question}</p>
            ${Object.entries(q.options).map(([key, value]) => `
                <label class="block mb-2 p-2 border rounded-md hover:bg-gray-100 cursor-pointer">
                    <input type="radio" name="p3q${index}" value="${key}" class="mr-2">
                    ${key.toUpperCase()}. ${value}
                </label>
            `).join('')}
        `;
        p3QuestionsContainer.appendChild(questionEl);
    });
    p3SubmitButton.classList.remove('hidden');
    p3NextPuzzleButton.classList.add('hidden');
    p3FeedbackOverall.textContent = '';
}

p3SubmitButton.addEventListener('click', () => {
    let correctCount = 0;
    p3Questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="p3q${index}"]:checked`);
        if (selectedOption && selectedOption.value === q.correctAnswer) {
            correctCount++;
            selectedOption.parentElement.classList.add('correct'); // Style correct label
        } else if (selectedOption) {
            selectedOption.parentElement.classList.add('incorrect'); // Style incorrect label
            // Highlight the correct one
            const correctRadio = document.querySelector(`input[name="p3q${index}"][value="${q.correctAnswer}"]`);
            if(correctRadio) correctRadio.parentElement.classList.add('correct');
        }
    });

    if (correctCount === p3Questions.length) {
        p3FeedbackOverall.textContent = 'All answers correct! Your data acumen is impressive!';
        p3FeedbackOverall.className = 'feedback-message mt-4 text-center feedback-correct';
        p3NextPuzzleButton.classList.remove('hidden');
        p3SubmitButton.classList.add('hidden');
    } else {
        p3FeedbackOverall.textContent = `You got ${correctCount} out of ${p3Questions.length} correct. All questions must be answered correctly to proceed. Review the highlighted answers and try again.`;
        p3FeedbackOverall.className = 'feedback-message mt-4 text-center feedback-incorrect';
        // Allow retry by resetting incorrect answers
        setTimeout(() => {
            p3QuestionsContainer.querySelectorAll('label').forEach(label => {
                label.classList.remove('correct', 'incorrect');
            });
            p3FeedbackOverall.textContent = '';
        }, 3000);
    }
});
p3NextPuzzleButton.addEventListener('click', () => {
    // Hide the next button to prevent duplicate clicks
    p3NextPuzzleButton.classList.add('hidden');
    
    // Show the post-completion area instead of directly displaying a clue
    document.getElementById('p3-post-completion-area').classList.remove('hidden');
});

// Add event listeners for the new clue discovery buttons in Puzzle 3
document.getElementById('p3-find-clue-button').addEventListener('click', () => {
    // Reveal the clue when the button is clicked
    document.getElementById('p3-revealed-clue').classList.remove('hidden');
    document.getElementById('p3-find-clue-button').classList.add('hidden');
});

document.getElementById('p3-continue-button').addEventListener('click', () => {
    showPuzzle('puzzle4-storage');
});

// --- Puzzle 4: Locked Storage ---
const p4Questions = [
    {
        question: "When storing physical documents containing Patient Health Information (PHI) at your Yale site, which of these is the MOST critical practice according to HIPAA?",
        options: { a: "Keeping them in a brightly lit, easily accessible area for convenience.", b: "Storing them in locked cabinets or a secure room with restricted access.", c: "Using colorful binders so they don't get mixed up with your lunch.", d: "Leaving them on your desk under a heavy textbook for 'gravity-based security.'" },
        correctAnswer: "b"
    },
    {
        question: "Your team is working with highly sensitive, proprietary data for the Decker Protein. What is a key principle for storing this digital information securely?",
        options: { a: "Saving it on a shared USB drive that everyone in the department can borrow.", b: "Using passwords like 'password123' or 'deckerprotein' for easy recall.", c: "Emailing it to your personal Gmail account for backup.", d: "Storing it on encrypted, access-controlled Yale servers or approved cloud storage with multi-factor authentication." },
        correctAnswer: "d"
    },
    {
        question: "According to Good Clinical Practice (GCP E6, R2 - 5.14.3), storage for investigational products must be:",
        options: { a: "Wherever there's space, even if it's next to the coffee machine.", b: "At room temperature, always, because refrigerators are too much trouble.", c: "As specified by the sponsor and in accordance with applicable regulatory requirements (which often means temperature-controlled and monitored).", d: "Handled by the intern, 'it builds character.'" },
        correctAnswer: "c"
    },
    {
        question: "For a clinical trial supporting a drug marketing application, how long does the FDA (21 CFR 312.62c) generally require investigators to retain study records *after* the drug is approved or the investigation is discontinued?",
        options: { a: "6 months – just enough time to publish.", b: "2 years.", c: "10 years – to match your PhD loan repayment schedule.", d: "Until the storage unit overflows or aliens invade, whichever comes first." },
        correctAnswer: "b"
    },
    {
        question: "Where should original essential documents (like signed consent forms) ideally be maintained throughout the trial?",
        options: { a: "In the PI's car for quick access during commutes.", b: "Digitized on a personal phone, then originals shredded for eco-friendliness.", c: "At the investigational site, securely, and accessible for monitoring/audit/inspection.", d: "Hidden in a secret compartment in the Sterling Memorial Library, for added mystique." },
        correctAnswer: "c"
    },
    {
        question: "When transporting biological specimens from the clinic to the laboratory, what is the most important consideration?",
        options: { a: "Using the fastest route possible, even if it means breaking traffic laws.", b: "Maintaining the specimen within required temperature ranges and ensuring proper biohazard containment.", c: "Making sure the specimens look visually appealing to laboratory staff.", d: "Texting the lab technician every 5 minutes with updates on your location." },
        correctAnswer: "b"
    },
    {
        question: "Yale's backup system for electronic research data should ideally include:",
        options: { a: "A single backup on the same computer where the original data is stored.", b: "Printouts of all data stored under your mattress at home.", c: "Regular backups to multiple secure locations, with at least one off-site backup.", d: "Memorizing all data points so you can recite them if computers fail." },
        correctAnswer: "c"
    },
    {
        question: "When storing source documents that contain both PHI and research data, what is the best practice?",
        options: { a: "Redact all PHI with a permanent marker before filing.", b: "Keep them only on a personal laptop for convenience.", c: "Store them in compliance with both HIPAA and research data retention requirements in a secure, access-controlled environment.", d: "Take photos of important pages with your smartphone for easy reference." },
        correctAnswer: "c"
    },
    {
        question: "A temperature excursion occurred in your medication storage refrigerator over the weekend. What should be done with the affected investigational product?",
        options: { a: "Use it anyway – refrigeration guidelines are just suggestions.", b: "Quarantine the product, document the excursion, and contact the sponsor for stability assessment before further use.", c: "Increase the dosage to compensate for any degradation.", d: "Hide the temperature logs and pretend it never happened." },
        correctAnswer: "b"
    },
    {
        question: "For a multi-site clinical trial, study data should be:",
        options: { a: "Shared freely via social media to promote transparency.", b: "Stored differently at each site according to individual site preferences.", c: "Accessible only to the sponsor, not the investigators.", d: "Managed according to a consistent data management plan that ensures security, integrity, and compliance across all sites." },
        correctAnswer: "d"
    }
];
const p4QuestionsContainer = document.getElementById('p4-questions-container');
const p4SubmitButton = document.getElementById('p4-submit-answers');
const p4FeedbackOverall = document.getElementById('p4-feedback-overall');
const p4NextPuzzleButton = document.getElementById('p4-next-puzzle');

function loadP4Questions() {
    p4QuestionsContainer.innerHTML = '';
    p4Questions.forEach((q, index) => {
        const questionEl = document.createElement('div');
        questionEl.classList.add('question-card');
        questionEl.innerHTML = `
            <p class="font-medium mb-3">${index + 1}. ${q.question}</p>
            ${Object.entries(q.options).map(([key, value]) => `
                <label class="block mb-2 p-2 border rounded-md hover:bg-gray-100 cursor-pointer">
                    <input type="radio" name="p4q${index}" value="${key}" class="mr-2">
                    ${key.toUpperCase()}. ${value}
                </label>
            `).join('')}
        `;
        p4QuestionsContainer.appendChild(questionEl);
    });
    p4SubmitButton.classList.remove('hidden');
    p4NextPuzzleButton.classList.add('hidden');
    p4FeedbackOverall.textContent = '';
}

p4SubmitButton.addEventListener('click', () => {
    let correctCount = 0;
    p4Questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="p4q${index}"]:checked`);
        if (selectedOption && selectedOption.value === q.correctAnswer) {
            correctCount++;
            selectedOption.parentElement.classList.add('correct');
        } else if (selectedOption) {
            selectedOption.parentElement.classList.add('incorrect');
             const correctRadio = document.querySelector(`input[name="p4q${index}"][value="${q.correctAnswer}"]`);
            if(correctRadio) correctRadio.parentElement.classList.add('correct');
        }
    });

    if (correctCount === p4Questions.length) {
        p4FeedbackOverall.textContent = 'Storage protocols mastered! Your diligence is commendable!';
        p4FeedbackOverall.className = 'feedback-message mt-4 text-center feedback-correct';
        p4NextPuzzleButton.classList.remove('hidden');
        p4SubmitButton.classList.add('hidden');
    } else {
        p4FeedbackOverall.textContent = `You correctly identified ${correctCount} out of ${p4Questions.length} storage protocols. All protocols must be correctly identified to proceed. Please review and try again.`;
        p4FeedbackOverall.className = 'feedback-message mt-4 text-center feedback-incorrect';
        setTimeout(() => {
            p4QuestionsContainer.querySelectorAll('label').forEach(label => {
                label.classList.remove('correct', 'incorrect');
            });
            p4FeedbackOverall.textContent = '';
        }, 3000);
    }
});
p4NextPuzzleButton.addEventListener('click', () => {
    // Hide the next button to prevent duplicate clicks
    p4NextPuzzleButton.classList.add('hidden');
    
    // Show the post-completion area instead of directly displaying a clue
    document.getElementById('p4-post-completion-area').classList.remove('hidden');
});

// Add event listeners for the new clue discovery buttons in Puzzle 4
document.getElementById('p4-find-clue-button').addEventListener('click', () => {
    // Reveal the clue when the button is clicked
    document.getElementById('p4-revealed-clue').classList.remove('hidden');
    document.getElementById('p4-find-clue-button').classList.add('hidden');
});

document.getElementById('p4-continue-button').addEventListener('click', () => {
    showPuzzle('puzzle5-limericks');
});

// --- Puzzle 5: Final Escape - Limericks ---
const p5Limericks = [
    {
        limerick: "A researcher named Stan, quite astute,<br>Found consent forms with fruit... (juice stains, that is!)<br>But the date of the sign,<br>Preceded the trial design!<br>What's the main issue to bruit?",
        keywords: ["INVALID CONSENT", "RECONSENT", "IRB NOTIFY", "DOCUMENTATION ERROR", "CONSENT ERROR"] // Allow variations
    },
    {
        limerick: "The trial drug, chilled with great care,<br>Had a freezer log showing hot air!<br>For two days it did bake,<br>A serious mistake.<br>What action now must you prepare?",
        keywords: ["QUARANTINE DRUG", "TEMP EXCURSION", "NOTIFY SPONSOR", "ASSESS PRODUCT", "PRODUCT STABILITY"]
    },
    {
        limerick: "Young Tim, in a trial so grand,<br>Took a drug not meant for his hand.<br>Wrong med, it appears,<br>Confirming their fears.<br>What's the first vital command?",
        keywords: ["PATIENT SAFETY", "ASSESS AE", "REPORT ERROR", "MEDICAL ASSESSMENT", "MEDICATION ERROR"]
    },
    {
        limerick: "A data breach, oh what a fright!<br>PHI was exposed in the night.<br>The sponsor's irate,<br>Sealing the site's fate.<br>What step makes the future look bright?",
        keywords: ["CONTAIN BREACH", "NOTIFY OFFICIALS", "CAPA", "REPORT BREACH", "PRIVACY INCIDENT"]
    }
];
const p5LimericksContainer = document.getElementById('p5-limericks-container');
const p5TimerDisplay = document.getElementById('p5-timer');
const p5SubmitEscapeButton = document.getElementById('p5-submit-escape');
const p5FeedbackEl = document.getElementById('p5-feedback');
let p5TimerInterval;
let p5TimeRemaining = 8 * 60; // 8 minutes in seconds (changed from 5 minutes)

function loadP5Limericks() {
    p5LimericksContainer.innerHTML = '';
    p5Limericks.forEach((item, index) => {
        const limerickEl = document.createElement('div');
        limerickEl.classList.add('mb-6', 'p-4', 'border', 'border-gray-300', 'rounded-lg', 'bg-white');
        limerickEl.innerHTML = `
            <div class="limerick-box">${index + 1}. ${item.limerick}</div>
            <input type="text" id="p5ans${index}" class="mt-2 border border-gray-300 p-2 rounded-lg w-full" placeholder="Enter keyword response...">
        `;
        p5LimericksContainer.appendChild(limerickEl);
    });
    // Timer will start when puzzle becomes visible, not when limericks are loaded
}

function startP5Timer() {
    clearInterval(p5TimerInterval); // Clear any existing timer
    p5TimerInterval = setInterval(() => {
        p5TimeRemaining--;
        const minutes = Math.floor(p5TimeRemaining / 60);
        const seconds = p5TimeRemaining % 60;
        p5TimerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (p5TimeRemaining <= 0) {
            clearInterval(p5TimerInterval);
            p5TimerDisplay.textContent = "0:00";
            p5SubmitEscapeButton.disabled = true;
            // Show the FDA Form 483 failure screen instead of just showing a message
            showPuzzle('failure-section');
        }
    }, 1000);
}

p5SubmitEscapeButton.addEventListener('click', () => {
    clearInterval(p5TimerInterval);
    let correctLimericks = 0;
    p5Limericks.forEach((limerick, index) => {
        const userAnswer = document.getElementById(`p5ans${index}`).value.toUpperCase().trim();
        if (limerick.keywords.some(kw => userAnswer.includes(kw))) {
            correctLimericks++;
            document.getElementById(`p5ans${index}`).classList.add('border-green-500', 'bg-green-50');
        } else {
             document.getElementById(`p5ans${index}`).classList.add('border-red-500', 'bg-red-50');
        }
    });

    if (correctLimericks === p5Limericks.length) { // Requiring all 4 correct for success
        p5FeedbackEl.textContent = `Critical actions identified! You've successfully managed the emergency response with all ${p5Limericks.length} correct! Proceeding to final debrief.`;
        p5FeedbackEl.className = 'feedback-message mt-4 text-center feedback-correct';
        setTimeout(() => {
            showPuzzle('success-section');
            // Show survey after 5 seconds of seeing the success screen
            setTimeout(() => showPuzzle('survey-section'), 5000);
        }, 2000);
    } else {
        p5FeedbackEl.textContent = `Only ${correctLimericks}/${p5Limericks.length} critical actions correctly identified. All actions must be correctly identified to succeed. Review your responses and try again.`;
        p5FeedbackEl.className = 'feedback-message mt-4 text-center feedback-incorrect';
        // Reset for retry
        setTimeout(() => {
            p5LimericksContainer.querySelectorAll('input').forEach(input => {
                input.classList.remove('border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50');
            });
            // Don't clear their answers to give them a chance to correct only the wrong ones
            // Restart the timer for another attempt
            p5TimeRemaining = 8 * 60; // Reset to 8 minutes
            startP5Timer();
            p5FeedbackEl.textContent = '';
        }, 3000);
    }
});

// --- Game Initialization ---
document.getElementById('start-game-button').addEventListener('click', () => {
    showPuzzle('puzzle1-biometric');
});

// Add event listener for the restart button
document.getElementById('restart-game-button').addEventListener('click', () => {
    showPuzzle('intro-section');
});

// Initialize first puzzle questions
window.onload = () => {
    showPuzzle('intro-section'); // Start with intro
    // Load questions for puzzles that need pre-population
    loadP1Question();
    loadP2Tiles();
    loadP3Questions();
    loadP4Questions();
    loadP5Limericks(); // Load the limericks but don't start the timer
}; 