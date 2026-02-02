// Mock Data for Online MCQs Platform

const SUBJECTS = [
    { id: 'math', name: 'Mathematics', icon: 'fa-calculator', color: '#e74c3c' },
    { id: 'phy', name: 'Physics', icon: 'fa-atom', color: '#3498db' },
    { id: 'chem', name: 'Chemistry', icon: 'fa-flask', color: '#9b59b6' },
    { id: 'cs', name: 'Computer Science', icon: 'fa-laptop-code', color: '#2ecc71' }
];

const TESTS = [
    {
        id: 'test-001',
        subjectId: 'math',
        title: 'Algebra Basics',
        level: 'Easy',
        questionsCount: 5,
        timeLimit: 300 // 5 minutes in seconds
    },
    {
        id: 'test-002',
        subjectId: 'cs',
        title: 'HTML & CSS Fundamentals',
        level: 'Medium',
        questionsCount: 5,
        timeLimit: 300
    },
    {
        id: 'test-003',
        subjectId: 'phy',
        title: 'Motion & Force',
        level: 'Hard',
        questionsCount: 5,
        timeLimit: 600
    }
];

const QUESTIONS = {
    'test-001': [
        { id: 1, text: "What is the value of x in 2x = 10?", options: ["2", "5", "10", "20"], correct: 1 },
        { id: 2, text: "Solve: 5 + 3 * 2", options: ["16", "11", "10", "13"], correct: 1 },
        { id: 3, text: "What is 15% of 200?", options: ["20", "30", "15", "25"], correct: 1 },
        { id: 4, text: "If a = 3 and b = 4, what is a^2 + b^2?", options: ["12", "25", "7", "49"], correct: 1 },
        { id: 5, text: "Simplify: 10 / 2 + 4", options: ["9", "5", "7", "8"], correct: 0 }
    ],
    'test-002': [
        { id: 1, text: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "None of these"], correct: 0 },
        { id: 2, text: "Which HTML tag is used to define an internal style sheet?", options: ["<script>", "<style>", "<css>", "<link>"], correct: 1 },
        { id: 3, text: "Which property is used to change the background color?", options: ["color", "bgcolor", "background-color", "bg-color"], correct: 2 },
        { id: 4, text: "How do you add a comment in CSS?", options: ["// this is a comment", "/* this is a comment */", "' this is a comment", "<!-- this is a comment -->"], correct: 1 },
        { id: 5, text: "Which HTML attribute is used to define inline styles?", options: ["class", "font", "style", "styles"], correct: 2 }
    ]
};

// Initial Setup (Run this in console if needed to reset)
if (!localStorage.getItem('subjects')) {
    localStorage.setItem('subjects', JSON.stringify(SUBJECTS));
}
if (!localStorage.getItem('tests')) {
    localStorage.setItem('tests', JSON.stringify(TESTS));
}
if (!localStorage.getItem('questions')) {
    localStorage.setItem('questions', JSON.stringify(QUESTIONS));
}

console.log('Mock Data Loaded');
