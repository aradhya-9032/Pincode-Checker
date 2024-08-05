document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pincode-form');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const pincode = document.getElementById('pincode');
    const checkbox = document.getElementById('checkbox');

    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const pincodeError = document.getElementById('pincodeError');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    const userDetails = document.getElementById('userDetails');
    const apiDetails = document.getElementById('apiDetails');

    form.addEventListener('submit', function(event) {
        // Prevent form from submitting
        event.preventDefault(); 
        let valid = true;

        // Clear previous error messages
        clearErrors();

        // Validate first name
        if (!firstName.value.trim()) {
            firstNameError.textContent = 'First name is required.';
            valid = false;
        }

        // Validate last name
        if (!lastName.value.trim()) {
            lastNameError.textContent = 'Last name is required.';
            valid = false;
        }

        // Validate email
        if (!email.value.trim()) {
            emailError.textContent = 'Email is required.';
            valid = false;
        } else if (!validateEmail(email.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            valid = false;
        }

        // Validate pincode
        if (!pincode.value.trim()) {
            pincodeError.textContent = 'Pincode is required.';
            valid = false;
        } else if (!validatePincode(pincode.value)) {
            pincodeError.textContent = 'Please enter a valid 6-digit pincode.';
            valid = false;
        }

        // Validate checkbox
        if (!checkbox.checked) {
            // confirm('You must agree to receive marketing emails.');
            valid = false;
        }

        // If all validations pass, fetch pincode data
        if (valid) {
            fetchPincodeData(pincode.value);
        }
    });

    // Clear error messages
    function clearErrors() {
        firstNameError.textContent = '';
        lastNameError.textContent = '';
        emailError.textContent = '';
        pincodeError.textContent = '';
    }

    // Validate email format
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Validate pincode format
    function validatePincode(pincode) {
        const pincodePattern = /^\d{6}$/;
        return pincodePattern.test(pincode);
    }

    // Fetch pincode data from API
    function fetchPincodeData(pincode) {
        fetch(`https://api.postalpincode.in/pincode/${pincode}`)
            .then(response => response.json())
            .then(data => {
                displayPopup(data);
            })
            .catch(error => {
                apiDetails.innerHTML = `<p>Error fetching pincode data: ${error.message}</p>`;
                showPopup();
            });
    }

    // Display popup with user details and pincode data
    function displayPopup(data) {
        userDetails.innerHTML = `
            <h2>User Details:</h2>
            <p>First Name: ${firstName.value}</p>
            <p>Last Name: ${lastName.value}</p>
            <p>Email: ${email.value}</p>
            <p>Pincode: ${pincode.value}</p>
        `;

        if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            apiDetails.innerHTML = `
                <h2>Pincode Details:</h2>
                <p>Post Office Name: ${postOffice.Name}</p>
                <p>District: ${postOffice.District}</p>
                <p>State: ${postOffice.State}</p>
            `;
        } else {
            apiDetails.innerHTML = '<p>Invalid Pincode.</p>';
        }

        showPopup();
    }

    // Show popup
    function showPopup() {
        popup.style.display = 'block';
    }

    // Hide popup and reset form
    function hidePopup() {
        popup.style.display = 'none';
        form.reset();
    }

    // Close popup on clicking the close button
    closePopup.addEventListener('click', function() {
        hidePopup();
    });

    // Close popup if the user clicks anywhere outside of the popup content
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            hidePopup();
        }
    });
});


