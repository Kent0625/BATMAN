// Wayne Enterprises - Security Protocol JS
const surveyData = [];

// Elements
const form = document.getElementById('surveyForm');
const surveyCard = document.getElementById('surveyCard');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const accessCodeInput = document.getElementById('accessToken');
const charCounter = document.getElementById('charCounter');
const vibeLevelInput = document.getElementById('vibeLevel');
const vibeDisplay = document.getElementById('vibeDisplay');
const visualFeedback = document.getElementById('visualFeedback');
//favoriteNumberInput
const submitBtn = document.getElementById('submitBtn');
const generateBtn = document.getElementById('generateBtn'); // Added this

// Justice alignment display logic
function updateJusticeFeedback(val) {
    let text = `${val}% JUSTICE`;
    let gifHtml = '';
    let isActive = false;

    if (val == 100) {
        text = `⚖️ ${val}% ABSOLUTE JUSTICE`;
        gifHtml = `<img src="batman.gif" alt="Batman Justice">`;
        isActive = true;
    } else if (val == 0) {
        text = `🃏 ${val}% CHAOS DETECTED`;
        gifHtml = `<img src="joker.gif" alt="Chaos">`;
        isActive = true;
    } else if (val > 70) {
        text = `🛡️ ${val}% PROTECTOR`;
    } else if (val > 50) {
        text = `🔦 ${val}% VIGILANTE`;
    } else if (val > 30) {
        text = `🎭 ${val}% ANTI-HERO`;
    } else {
        text = `❔ ${val}% UNCERTAIN`;
    }

    vibeDisplay.textContent = text;
    
    if (isActive) {
        visualFeedback.innerHTML = gifHtml;
        visualFeedback.classList.add('active');
    } else {
        visualFeedback.classList.remove('active');
        setTimeout(() => {
            if (!visualFeedback.classList.contains('active')) {
                visualFeedback.innerHTML = '';
            }
        }, 500);
    }
}

vibeLevelInput.addEventListener('input', function() {
    updateJusticeFeedback(this.value);
});

updateJusticeFeedback(vibeLevelInput.value);

// Character counter
nameInput.addEventListener('input', function() {
    const length = this.value.length;
    const maxLength = 50;
    charCounter.querySelector('.counter-text').textContent = `${length}/${maxLength} CHARACTERS`;
});

// Validation Helper
function showError(input, errorElement, message) {
    input.style.borderBottomColor = '#ff4d4d';
    errorElement.textContent = message;
    errorElement.classList.add('show');
    surveyCard.classList.add('shake');
    setTimeout(() => surveyCard.classList.remove('shake'), 400);
}

function clearError(input, errorElement) {
    input.style.borderBottomColor = '';
    errorElement.classList.remove('show');
}

[nameInput, ageInput, emailInput, accessCodeInput].forEach(input => {
    input.addEventListener('input', () => {
        const errorId = `${input.id}Error`;
        clearError(input, document.getElementById(errorId));
    });
});

// --- NEW FEATURE: Access Code Generator ---
function generateAccessCode() {
    // Generate random number between 0 and 9999
    const randomNum = Math.floor(Math.random() * 10000);
    // Pad with zeros (e.g. 7 -> "0007")
    const code = randomNum.toString().padStart(4, '0');
    
    // Typing effect
    accessCodeInput.value = '';
    let i = 0;
    const typeWriter = setInterval(() => {
        accessCodeInput.value += code.charAt(i);
        i++;
        if (i >= code.length) {
            clearInterval(typeWriter);
            // Clear error specifically after typing finishes
            clearError(accessCodeInput, document.getElementById('AccessCodeError'));
        }
    }, 50);
}

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    generateAccessCode();
});
// ------------------------------------------

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    let firstError = null;

    if (nameInput.value.trim().length === 0) {
        showError(nameInput, document.getElementById('nameError'), 'IDENTITY REQUIRED.');
        isValid = false;
        if (!firstError) firstError = nameInput;
    }

    if (!ageInput.value || parseInt(ageInput.value) < 18) {
        showError(ageInput, document.getElementById('ageError'), 'MINIMUM AGE 18 REQUIRED.');
        isValid = false;
        if (!firstError) firstError = ageInput;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, document.getElementById('emailError'), 'INVALID SECURE CHANNEL.');
        isValid = false;
        if (!firstError) firstError = emailInput;
    }

    if (!accessCodeInput.value) {
        showError(accessCodeInput, document.getElementById('AccessCodeError'), 'ACCESS CODE REQUIRED. CLICK GENERATE.');
        isValid = false;
        if (!firstError) firstError = accessCodeInput;
    }

    if (isValid) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING TO BATCOMPUTER…';
        const spinner = document.getElementById('spinner');
        if(spinner) spinner.hidden = false;

        const formData = {
            name: nameInput.value.trim(),
            age: parseInt(ageInput.value),
            email: emailInput.value.trim(),
            justice_level: parseInt(vibeLevelInput.value),
            access_token: accessCodeInput.value, // Sends as String
            timestamp: new Date().toISOString()
        };

        fetch('http://127.0.0.1:8000/submit/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                localStorage.setItem('lastSurvey', JSON.stringify({
                    name: formData.name,
                    justiceLevel: formData.justice_level
                }));
                setTimeout(() => {
                    window.location.href = 'thankyou.html';
                }, 1500);
            } else {
                throw new Error('Server Rejected Protocol');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("CONNECTION FAILED. IS THE BACKEND RUNNING?");
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'RETRY CONNECTION';
        });
    } else {
        if (firstError) firstError.focus();
    }
});