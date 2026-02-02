// Test Engine Logic

let currentTest = null;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // Map of questionId -> selectedOptionIndex
let timerInterval = null;
let timeLeft = 0;

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    // User Info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6a11cb&color=fff`;

    // Load Test Data
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');

    if (!testId) {
        alert('No test selected!');
        window.location.href = 'dashboard.html';
        return;
    }

    const allTests = JSON.parse(localStorage.getItem('tests'));
    const allQuestions = JSON.parse(localStorage.getItem('questions'));
    const subjects = JSON.parse(localStorage.getItem('subjects'));

    currentTest = allTests.find(t => t.id === testId);
    questions = allQuestions[testId] || [];

    if (!currentTest || questions.length === 0) {
        alert('Test data not found!');
        window.location.href = 'dashboard.html';
        return;
    }

    const subject = subjects.find(s => s.id === currentTest.subjectId);

    // Initial Render
    document.getElementById('testTitle').textContent = currentTest.title;
    document.getElementById('subjectName').textContent = subject ? subject.name : 'Unknown';
    document.getElementById('totalQNum').textContent = questions.length;
    timeLeft = currentTest.timeLimit;

    renderPalette();
    loadQuestion(0);
    startTimer();

    // Event Listeners
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) loadQuestion(currentQuestionIndex - 1);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) loadQuestion(currentQuestionIndex + 1);
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        const qId = questions[currentQuestionIndex].id;
        delete userAnswers[qId];
        renderPalette();
        loadQuestion(currentQuestionIndex); // re-render to clear selection
    });

    document.getElementById('submitBtn').addEventListener('click', () => {
        showSubmitModal();
    });
});

function startTimer() {
    const display = document.getElementById('timerDisplay');
    timerInterval = setInterval(() => {
        timeLeft--;
        display.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Submitting your test automatically.');
            finishTest();
        }

        // Warning color
        if (timeLeft < 60) {
            display.classList.add('text-danger');
            display.classList.remove('text-dark'); // assuming default was dark/black
        }
    }, 1000);
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const q = questions[index];

    document.getElementById('currentQNum').textContent = index + 1;
    document.getElementById('questionText').textContent = q.text;

    // Options
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        const isSelected = userAnswers[q.id] === idx;
        div.className = `option-card ${isSelected ? 'selected' : ''}`;
        div.innerHTML = `<span class="fw-bold me-2">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
        div.onclick = () => selectOption(q.id, idx);
        container.appendChild(div);
    });

    // Buttons State
    document.getElementById('prevBtn').disabled = index === 0;

    if (index === questions.length - 1) {
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'inline-block';
    } else {
        document.getElementById('nextBtn').style.display = 'inline-block';
        document.getElementById('submitBtn').style.display = 'none';
    }

    updatePalette();
}

function selectOption(qId, optionIndex) {
    userAnswers[qId] = optionIndex;
    loadQuestion(currentQuestionIndex); // re-render to show selection
    updatePalette();
}

function renderPalette() {
    const container = document.getElementById('questionPalette');
    container.innerHTML = '';
    questions.forEach((q, idx) => {
        const btn = document.createElement('button');
        btn.className = `question-palette-btn ${idx === currentQuestionIndex ? 'active' : ''}`;
        btn.textContent = idx + 1;
        btn.onclick = () => loadQuestion(idx);
        btn.id = `palette-btn-${idx}`;
        container.appendChild(btn);
    });
}

function updatePalette() {
    questions.forEach((q, idx) => {
        const btn = document.getElementById(`palette-btn-${idx}`);
        if (btn) {
            // Reset base classes
            btn.className = 'question-palette-btn';

            // Add Answered class
            if (userAnswers[q.id] !== undefined) {
                btn.classList.add('answered');
            }

            // Add Active class (overrides answered if it's the current one for visual focus)
            if (idx === currentQuestionIndex) {
                btn.classList.add('active');
            }
        }
    });
}

function showSubmitModal() {
    const answeredCount = Object.keys(userAnswers).length;
    document.getElementById('modalTotal').textContent = questions.length;
    document.getElementById('modalAnswered').textContent = answeredCount;
    document.getElementById('modalUnanswered').textContent = questions.length - answeredCount;

    const modal = new bootstrap.Modal(document.getElementById('submitModal'));
    modal.show();
}

function finishTest() {
    clearInterval(timerInterval);

    // Calculate Result
    let correctCount = 0;
    questions.forEach(q => {
        if (userAnswers[q.id] === q.correct) {
            correctCount++;
        }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // Save Result
    const attempt = {
        id: Date.now(),
        testId: currentTest.id,
        testTitle: currentTest.title,
        subjectId: currentTest.subjectId,
        subjectName: document.getElementById('subjectName').textContent,
        date: new Date().toISOString(),
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: questions.length - correctCount, // Includes skipped as wrong
        percentage: score,
        userAnswers: userAnswers // Save details for review if needed
    };

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const historyKey = 'history_' + user.email;
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    history.unshift(attempt); // Add to top
    localStorage.setItem(historyKey, JSON.stringify(history));

    // Store current result in session for display
    localStorage.setItem('currentResult', JSON.stringify(attempt));

    window.location.href = 'results.html';
}

function confirmExit() {
    if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
        window.location.href = 'dashboard.html';
    }
}
