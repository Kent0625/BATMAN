// Wayne Enterprises - Security Protocol JS
const surveyData = [];

// --- AUTO-GENERATION LOGIC ---
function generateAccessCode() {
    // Only generate if the field is currently empty
    if (favoriteNumberInput.value === "") {
        const code = Math.floor(100000 + Math.random() * 900000);
        favoriteNumberInput.value = code;
        
        // Trigger an input event so the validation logic knows the field is filled
        favoriteNumberInput.dispatchEvent(new Event('input'));
        
        // Visual cue: JavaScript-forced colors removed to let CSS handle the styling
    }
}

// Logic to check if required fields are valid
function checkFormCompletion() {
    const isNameValid = nameInput.value.trim().length > 0;
    const isAgeValid = ageInput.value && parseInt(ageInput.value) >= 18;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailInput.value);

    // Criteria: All primary identity fields must be valid before unlocking the code
    if (isNameValid && isAgeValid && isEmailValid) {
        generateAccessCode();
    } else {
        // If they delete required info, we revoke the code
        favoriteNumberInput.value = "";
    }
}

// Elements
const form = document.getElementById('surveyForm');
const surveyCard = document.getElementById('surveyCard');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const favoriteNumberInput = document.getElementById('favoriteNumber');
const charCounter = document.getElementById('charCounter');
const vibeLevelInput = document.getElementById('vibeLevel');
const vibeDisplay = document.getElementById('vibeDisplay');
const visualFeedback = document.getElementById('visualFeedback');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');

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

// INITIALIZE: Run feedback on load
window.addEventListener('load', () => {
    updateJusticeFeedback(vibeLevelInput.value);
});

// Character counter
nameInput.addEventListener('input', function() {
    const length = this.value.length;
    const maxLength = 50;
    charCounter.querySelector('.counter-text').textContent = `${length}/${maxLength} CHARACTERS`;
});

// Validation Visuals
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

// Check completion whenever user inputs data
[nameInput, ageInput, emailInput, favoriteNumberInput].forEach(input => {
    input.addEventListener('input', () => {
        const errorId = `${input.id}Error`;
        const errorEl = document.getElementById(errorId);
        if (errorEl) clearError(input, errorEl);
        
        // Identity field check to trigger code generation
        if (input !== favoriteNumberInput) {
            checkFormCompletion();
        }
    });
});

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

    if (!favoriteNumberInput.value) {
        showError(favoriteNumberInput, document.getElementById('favoriteNumberError'), 'ACCESS CODE REQUIRED. COMPLETE IDENTITY PROFILE.');
        isValid = false;
        if (!firstError) firstError = favoriteNumberInput;
    }

    if (isValid) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'AUTHENTICATING…';
        if (spinner) spinner.hidden = false;

        const formData = {
            name: nameInput.value.trim(),
            age: ageInput.value,
            email: emailInput.value.trim(),
            justiceLevel: vibeLevelInput.value,
            accessCode: favoriteNumberInput.value,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('lastSurvey', JSON.stringify(formData));

        setTimeout(() => {
            window.location.href = 'thankyou.html';
        }, 1500);
    } else if (firstError) {
        firstError.focus();
    }
});
