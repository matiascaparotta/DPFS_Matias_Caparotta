document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("register-form");
    const firstNameInput = document.getElementById("first_name");
    const lastNameInput = document.getElementById("last_name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const userImageInput = document.getElementById("user_image");

    // Función para validar si el elemento existe antes de modificarlo
    const showError = (input, message, errorId) => {
        const errorSpan = document.getElementById(errorId);
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    };

    const validateName = (input) => input.value.trim().length < 2 ? "Debe tener al menos 2 caracteres." : "";
    const validateEmail = (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "Correo inválido." : "";
    const validatePassword = (password) => !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password.value) ? "Debe tener 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial." : "";
    const validateImage = (input) => {
        if (input.files.length > 0) {
            const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
            const fileExtension = "." + input.files[0].name.split(".").pop().toLowerCase();
            return !allowedExtensions.includes(fileExtension) ? "Formato inválido. Solo JPG, JPEG, PNG, GIF." : "";
        }
        return "";
    };

    firstNameInput.addEventListener("blur", () => showError(firstNameInput, validateName(firstNameInput), "error-first-name"));
    lastNameInput.addEventListener("blur", () => showError(lastNameInput, validateName(lastNameInput), "error-last-name"));
    emailInput.addEventListener("blur", () => showError(emailInput, validateEmail(emailInput), "error-email"));
    passwordInput.addEventListener("blur", () => showError(passwordInput, validatePassword(passwordInput), "error-password"));
    userImageInput.addEventListener("change", () => showError(userImageInput, validateImage(userImageInput), "error-user-image"));

    form.addEventListener("submit", function (event) {
        let hasErrors = false;
        if (validateName(firstNameInput)) { showError(firstNameInput, validateName(firstNameInput), "error-first-name"); hasErrors = true; }
        if (validateName(lastNameInput)) { showError(lastNameInput, validateName(lastNameInput), "error-last-name"); hasErrors = true; }
        if (validateEmail(emailInput)) { showError(emailInput, validateEmail(emailInput), "error-email"); hasErrors = true; }
        if (validatePassword(passwordInput)) { showError(passwordInput, validatePassword(passwordInput), "error-password"); hasErrors = true; }
        if (validateImage(userImageInput)) { showError(userImageInput, validateImage(userImageInput), "error-user-image"); hasErrors = true; }
        if (hasErrors) event.preventDefault();
    });
});