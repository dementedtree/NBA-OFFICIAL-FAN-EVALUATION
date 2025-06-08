// Global variables
let currentQuestionIndex = 0;
let userName = '';
let favoritePlayer = '';
let favoriteTeam = '';

// Quiz questions (all rigged to lead to the roast)
const quizQuestions = [{
        question: "Who is considered the most overrated player in the NBA right now?",
        options: [
            "LeBron James",
            "Stephen Curry",
            "Shai Gilgeous-Alexander",
            "Giannis Antetokounmpo"
        ],
        correct: 2
    },
    {
        question: "What's the most important quality in a true NBA fan?",
        options: [
            "Loyalty to one team through good and bad times",
            "Following whoever is winning",
            "Switching teams when your favorite player gets traded",
            "Only watching playoff games"
        ],
        correct: 0
    },
    {
        question: "Which team has the most bandwagon fans?",
        options: [
            "Los Angeles Lakers",
            "Golden State Warriors",
            "Oklahoma City Thunder",
            "Boston Celtics"
        ],
        correct: 2
    },
    {
        question: "What's the best way to evaluate a player's impact?",
        options: [
            "Advanced analytics and team success",
            "Highlight reels and social media buzz",
            "Individual stats only",
            "How much ESPN talks about them"
        ],
        correct: 0
    },
    {
        question: "True or false: Tyrese Haliburton is better than SGA",
        options: [
            "True - Haliburton is clearly superior",
            "False - SGA is better",
            "They're about equal",
            "I don't know enough to say"
        ],
        correct: 0
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showPage('landing-page');
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', () => {
        showPage('registration-page');
    });

    // Registration form
    document.getElementById('registration-form').addEventListener('submit', handleRegistration);

    // Mini game buttons
    document.getElementById('start-game1').addEventListener('click', startShotClockGame);
    document.getElementById('start-game2').addEventListener('click', startCourtVisionGame);

    // Next question button
    document.getElementById('next-question').addEventListener('click', nextQuestion);
}

// Page management
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    document.getElementById(pageId).classList.add('active');
}

// Handle registration
function handleRegistration(e) {
    e.preventDefault();

    userName = document.getElementById('name').value;
    favoritePlayer = document.getElementById('favorite-player').value;
    favoriteTeam = document.getElementById('favorite-team').value;

    // Start the quiz
    showPage('quiz-page');
    startQuiz();
}

// Quiz functionality
function startQuiz() {
    currentQuestionIndex = 0;
    displayQuestion();
}

function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');

    document.getElementById('question-text').textContent = question.question;

    const optionsHtml = question.options.map((option, index) =>
        `<div class="answer-option" onclick="selectAnswer(${index})">${option}</div>`
    ).join('');

    document.getElementById('answer-options').innerHTML = optionsHtml;
    document.getElementById('next-question').style.display = 'none';

    // Update progress
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = progress + '%';
}

function selectAnswer(selectedIndex) {
    // Remove previous selections
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });

    // Mark selected answer
    document.querySelectorAll('.answer-option')[selectedIndex].classList.add('selected');

    // Show next button
    document.getElementById('next-question').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        // Quiz complete, move to first mini game
        showPage('minigame1-page');
    }
}

// Shot Clock Mini Game
function startShotClockGame() {
    const shotClock = document.getElementById('shot-clock');
    const basketball = document.getElementById('basketball');
    const startBtn = document.getElementById('start-game1');
    const resultDiv = document.getElementById('game1-result');

    startBtn.style.display = 'none';
    resultDiv.textContent = '';

    let timeLeft = 24;
    let gameActive = false;

    const countdown = setInterval(() => {
        shotClock.textContent = timeLeft;

        if (timeLeft === 10) {
            gameActive = true;
            basketball.style.cursor = 'pointer';
            basketball.style.transform = 'scale(1.2)';
        }

        if (timeLeft === 0) {
            clearInterval(countdown);
            if (gameActive) {
                resultDiv.textContent = 'Time\'s up! But great effort!';
                resultDiv.style.color = '#c8102e';
            }
            setTimeout(() => {
                showPage('minigame2-page');
            }, 2000);
        }

        timeLeft--;
    }, 100); // Faster countdown for dramatic effect

    basketball.onclick = () => {
        if (gameActive) {
            clearInterval(countdown);
            resultDiv.textContent = 'Perfect timing! Elite reaction speed detected!';
            resultDiv.style.color = '#28a745';
            setTimeout(() => {
                showPage('minigame2-page');
            }, 2000);
        }
    };
}

// Court Vision Mini Game
function startCourtVisionGame() {
    const grid = document.getElementById('court-vision-grid');
    const startBtn = document.getElementById('start-game2');
    const resultDiv = document.getElementById('game2-result');

    startBtn.style.display = 'none';
    resultDiv.textContent = '';

    // Create grid of basketballs
    grid.innerHTML = '';
    const basketballs = ['🏀', '⚽', '🏈', '🎾', '🏀', '⚾', '🏐', '🏀'];

    // Shuffle array
    for (let i = basketballs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [basketballs[i], basketballs[j]] = [basketballs[j], basketballs[i]];
    }

    basketballs.forEach((ball, index) => {
        const ballElement = document.createElement('div');
        ballElement.className = 'vision-ball';
        ballElement.textContent = ball;
        ballElement.onclick = () => selectBall(ball, ballElement);
        grid.appendChild(ballElement);
    });
}

function selectBall(ball, element) {
    const resultDiv = document.getElementById('game2-result');

    // Always show success regardless of choice
    resultDiv.textContent = 'Excellent court vision! You found it!';
    resultDiv.style.color = '#28a745';

    element.style.background = 'rgba(40, 167, 69, 0.3)';

    // Disable all balls
    document.querySelectorAll('.vision-ball').forEach(ball => {
        ball.onclick = null;
        ball.style.cursor = 'default';
    });

    setTimeout(() => {
        showPage('loading-page');
        startLoadingSequence();
    }, 2000);
}

// Loading sequence before the roast
function startLoadingSequence() {
    const loadingText = document.getElementById('loading-text');
    const progressBar = document.getElementById('loading-progress');

    const loadingMessages = [
        'Evaluating basketball knowledge...',
        'Analyzing fan loyalty patterns...',
        'Cross-referencing with NBA database...',
        'Detecting bandwagon tendencies...',
        'Calculating SGA obsession levels...',
        'Comparing to Tyrese Haliburton stats...',
        'Finalizing assessment...',
        'Preparing results...'
    ];

    let messageIndex = 0;
    let progress = 0;

    const loadingInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length) {
            loadingText.textContent = loadingMessages[messageIndex];
            progress += 12.5;
            progressBar.style.width = progress + '%';
            messageIndex++;
        } else {
            clearInterval(loadingInterval);
            // THE ROAST BEGINS
            setTimeout(() => {
                showFinalResults();
            }, 1000);
        }
    }, 800);
}

// The ultimate roast reveal
function showFinalResults() {
    showPage('results-page');

    // Update the name in the certificate
    document.getElementById('final-name').textContent = userName.toUpperCase();

    // Play the roast audio after a short delay
    setTimeout(() => {
        const audio = document.getElementById('roast-audio');
        audio.play().catch(error => {
            console.log('Audio autoplay prevented:', error);
            // Add a click-to-play message if autoplay fails
            const audioContainer = audio.parentElement;
            const playButton = document.createElement('button');
            playButton.textContent = 'Click to hear your personalized message!';
            playButton.className = 'primary-btn';
            playButton.style.marginTop = '20px';
            playButton.onclick = () => {
                audio.play();
                playButton.remove();
            };
            audioContainer.appendChild(playButton);
        });
    }, 2000);

    // Add some extra dramatic effects
    setTimeout(() => {
        document.querySelector('.certificate').style.animation = 'pulse 1s infinite';
    }, 3000);
}

// Easter egg: Konami code for extra roast
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);

    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }

    if (konamiCode.length === konamiSequence.length &&
        konamiCode.every((code, index) => code === konamiSequence[index])) {

        // Secret extra roast
        if (document.getElementById('results-page').classList.contains('active')) {
            const extraRoast = document.createElement('div');
            extraRoast.innerHTML = '<h2 style="color: #ff6b6b; margin-top: 20px;">BONUS ROAST UNLOCKED: Even your gaming skills are as weak as your basketball takes! 🎮</h2>';
            document.querySelector('.roast-content').appendChild(extraRoast);
        }

        konamiCode = [];
    }
});

// Prevent right-click to make it seem more official
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Add some random "loading" delays to make it feel more authentic
function addRandomDelay(callback, baseDelay = 1000) {
    const randomDelay = baseDelay + Math.random() * 1000;
    setTimeout(callback, randomDelay);
}