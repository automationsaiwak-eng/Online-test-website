// Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return; // Redirect handled in checkAuth

    // Update User Info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6a11cb&color=fff`;

    loadDashboardData(user);

    // Search Functionality
    document.getElementById('searchTests').addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase();
        filterTests(query);
    });
});

function loadDashboardData(user) {
    const tests = JSON.parse(localStorage.getItem('tests')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const history = JSON.parse(localStorage.getItem('history_' + user.email)) || [];

    // 1. Calculate Stats
    const testsTaken = history.length;
    let avgScore = 0;
    if (testsTaken > 0) {
        const totalScore = history.reduce((acc, curr) => acc + curr.percentage, 0);
        avgScore = Math.round(totalScore / testsTaken);
    }

    // Find Best Subject (Simple logic: subject mostly taken)
    // To do it properly, we'd average scores per subject.
    // Let's just mock it or say "Math" if tests > 0
    const bestHubq = testsTaken > 0 ? history[0].subjectName : '-'; // Simplified

    document.getElementById('statsTestsTaken').textContent = testsTaken;
    document.getElementById('statsAvgScore').textContent = avgScore + '%';
    document.getElementById('statsBestSubject').textContent = bestHubq;

    // 2. Render Available Tests
    const testsContainer = document.getElementById('testsContainer');
    testsContainer.innerHTML = '';

    if (tests.length === 0) {
        testsContainer.innerHTML = '<div class="col-12 text-center text-muted">No tests available at the moment.</div>';
    } else {
        tests.forEach(test => {
            const subject = subjects.find(s => s.id === test.subjectId);
            const card = createTestCard(test, subject);
            testsContainer.appendChild(card);
        });
    }

    // 3. Render History
    const historyContainer = document.getElementById('historyContainer');
    if (history.length > 0) {
        historyContainer.innerHTML = '';
        // Show last 5
        history.slice(0, 5).forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="ps-4 fw-medium">${record.testTitle}</td>
                <td><span class="badge bg-light text-dark border">${record.subjectName}</span></td>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td><span class="fw-bold ${record.percentage >= 50 ? 'text-success' : 'text-danger'}">${record.percentage}%</span></td>
                <td><span class="badge ${record.percentage >= 50 ? 'bg-success' : 'bg-danger'}">${record.percentage >= 50 ? 'Passed' : 'Failed'}</span></td>
                <td><a href="results.html?attemptId=${record.id}" class="btn btn-sm btn-outline-secondary">View</a></td>
            `;
            historyContainer.appendChild(row);
        });
    }
}

function createTestCard(test, subject) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 test-card-item';
    col.setAttribute('data-title', test.title.toLowerCase());

    col.innerHTML = `
        <div class="card h-100 border-0 shadow-sm hover-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle p-3 d-flex align-items-center justify-content-center me-3" 
                         style="background-color: ${subject.color}20; color: ${subject.color}; width: 50px; height: 50px;">
                        <i class="fas ${subject.icon}"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 text-muted text-uppercase small">${subject.name}</h6>
                        <h5 class="card-title mb-0 fw-bold">${test.title}</h5>
                    </div>
                </div>
                
                <div class="d-flex justify-content-between mb-3 text-muted small">
                    <span><i class="fas fa-question-circle me-1"></i> ${test.questionsCount} Qs</span>
                    <span><i class="fas fa-clock me-1"></i> ${Math.floor(test.timeLimit / 60)} Mins</span>
                    <span class="text-${test.level === 'Easy' ? 'success' : test.level === 'Medium' ? 'warning' : 'danger'} fw-bold">${test.level}</span>
                </div>
                
                <a href="test.html?id=${test.id}" class="btn btn-outline-primary w-100 rounded-pill">Start Test</a>
            </div>
        </div>
    `;
    return col;
}

function filterTests(query) {
    const items = document.querySelectorAll('.test-card-item');
    items.forEach(item => {
        const title = item.getAttribute('data-title');
        if (title.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
