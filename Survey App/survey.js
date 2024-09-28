// script.js

document.addEventListener('DOMContentLoaded', () => {
    const surveyForm = document.getElementById('survey-form');
    const surveyResults = document.getElementById('survey-results');
    const responsesList = document.getElementById('responses-list');
    const resetButton = document.getElementById('reset-button');
    const farmingTypeRadios = document.getElementsByName('farmingType');
    const cropTypesGroup = document.getElementById('crop-types-group');

    // Show or hide crop types based on farming type
    farmingTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Crop Farming' && radio.checked) {
                cropTypesGroup.style.display = 'block';
            } else {
                cropTypesGroup.style.display = 'none';
                // Uncheck all crop checkboxes if hidden
                const cropCheckboxes = cropTypesGroup.querySelectorAll('input[name="crops"]');
                cropCheckboxes.forEach(checkbox => checkbox.checked = false);
            }
        });
    });

    // Function to show error messages
    const showError = (inputId, message) => {
        const errorElement = document.getElementById(`${inputId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    };

    // Function to clear error messages
    const clearErrors = () => {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    };

    // Function to collect form data
    const getFormData = () => {
        const fullName = document.getElementById('full-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const location = document.getElementById('location').value.trim();
        const farmingType = document.querySelector('input[name="farmingType"]:checked')?.value || '';
        const crops = Array.from(document.querySelectorAll('input[name="crops"]:checked')).map(el => el.value);
        const farmSize = document.getElementById('farm-size').value;
        const challenges = Array.from(document.querySelectorAll('input[name="challenges"]:checked')).map(el => el.value);
        const technology = document.getElementById('technology').value;
        const comments = document.getElementById('comments').value.trim();

        return { fullName, email, location, farmingType, crops, farmSize, challenges, technology, comments };
    };

    // Function to validate form data
    const validateForm = (data) => {
        let isValid = true;

        // Validate Full Name
        if (data.fullName === '') {
            showError('full-name', 'Full Name is required.');
            isValid = false;
        } else if (!/^[A-Za-z]/.test(data.fullName)) {
            showError('full-name', 'Full Name must start with a letter.');
            isValid = false;
        }

        // Validate Email
        if (data.email === '') {
            showError('email', 'Email is required.');
            isValid = false;
        } else {
            // Simple email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showError('email', 'Please enter a valid email.');
                isValid = false;
            } else if (/^\d/.test(data.email)) {
                showError('email', 'Email should not start with a number.');
                isValid = false;
            }
        }

        // Validate Location
        if (data.location === '') {
            showError('location', 'Farm Location is required.');
            isValid = false;
        }

        // Validate Farming Type
        if (data.farmingType === '') {
            showError('farmingType', 'Please select your type of farming.');
            isValid = false;
        }

        // Validate Crop Types if Farming Type is Crop Farming
        if (data.farmingType === 'Crop Farming' && data.crops.length === 0) {
            showError('crop-types-group', 'Please select at least one crop type.');
            isValid = false;
        }

        // Validate Farm Size
        if (data.farmSize === '') {
            showError('farm-size', 'Please select your farm size.');
            isValid = false;
        }

        return isValid;
    };

    // Function to save data to local storage
    const saveData = (data) => {
        let surveys = JSON.parse(localStorage.getItem('farmerSurveys')) || [];
        surveys.push(data);
        localStorage.setItem('farmerSurveys', JSON.stringify(surveys));
    };

    // Function to display results
    const displayResults = (data) => {
        responsesList.innerHTML = `
            <li><strong>Full Name:</strong> ${data.fullName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Farm Location:</strong> ${data.location}</li>
            <li><strong>Type of Farming:</strong> ${data.farmingType}</li>
            ${data.farmingType === 'Crop Farming' ? `<li><strong>Crop Types:</strong> ${data.crops.join(', ')}</li>` : ''}
            <li><strong>Farm Size:</strong> ${data.farmSize}</li>
            <li><strong>Challenges Faced:</strong> ${data.challenges.length > 0 ? data.challenges.join(', ') : 'None'}</li>
            <li><strong>Uses Agricultural Technology:</strong> ${data.technology || 'Not Specified'}</li>
            <li><strong>Additional Comments:</strong> ${data.comments || 'None'}</li>
        `;
        surveyForm.classList.add('hidden');
        surveyResults.classList.remove('hidden');
    };

    // Handle form submission
    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        const formData = getFormData();

        if (validateForm(formData)) {
            saveData(formData);
            displayResults(formData);
            surveyForm.reset();
            cropTypesGroup.style.display = 'none';
        }
    });

    // Handle reset button
    resetButton.addEventListener('click', () => {
        surveyResults.classList.add('hidden');
        surveyForm.classList.remove('hidden');
    });
});
