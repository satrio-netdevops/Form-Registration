const form = document.querySelector('form')
const pictureInput = document.getElementById('picture');
const birthDateInput = document.getElementById('date')

flatpickr("#date", {
    dateFormat: "Y-m-d", 
    maxDate: "today",
    disableMobile: "true",
    altInput: true,      
    altFormat: "d-m-Y",

    onChange: function(selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
            instance.altInput.classList.add('valid-border');
            
            instance.altInput.classList.remove('border-danger');
            const container = instance.altInput.closest('.input-box');
            const errorMsg = container.querySelector('.text-danger');
            if (errorMsg) errorMsg.remove();
        } else {
            instance.altInput.classList.remove('valid-border');
        }

        if (selectedDates.length > 0) {
            instance.altInput.classList.add('has-text');
        } else {
            instance.altInput.classList.remove('has-text');
        }
    },

    onReady: function(selectedDates, dateStr, instance) {
        if (selectedDates.length > 0 || instance.input.value !== "") {
            instance.altInput.classList.add('has-text');
        }
    }
});

const showError = (field, errorText) => {
    if (field._flatpickr && field._flatpickr.altInput) {
        field._flatpickr.altInput.classList.add('border-danger');
    } else {
        field.classList.add('border-danger');
    }

    const errorElement = document.createElement('p')
    errorElement.classList.add('text-danger')
    errorElement.innerText = errorText

    field.closest('.input-box').appendChild(errorElement)
}

const radioError = (field, errorText) => {
    const errorElement = document.createElement('p')
    errorElement.classList.add('text-danger')
    errorElement.innerText = errorText

    field.appendChild(errorElement)
}

const handleSubmit = (e) => {
    e.preventDefault()
    console.log("1. Tombol Register Ditekan");
    const fullNameInput = document.getElementById('full-name')
    const userNameInput = document.getElementById('username')
    const emailInput = document.getElementById('email')
    const phoneInput = document.getElementById('phone')
    const genderTitle = document.querySelector('.gender-details')
    const roleTitle = document.querySelector('.role-details')

    const genderInput = document.getElementsByClassName('gender')
    const gendersRadio = document.querySelector('input[name="gender"]:checked')
    const roleCheckBox = document.querySelector('input[name="role"]:checked')
    // const birthDateInput = document.getElementById('birth-date')

    const fullName = fullNameInput.value.trim()
    const userName = userNameInput.value.trim()
    const email = emailInput.value.trim()
    const phone = parseInt(phoneInput.value.trim())
    const birthDate = birthDateInput.value
    const genders = []
    for(let i=0; i < genderInput.length; i++) {
        genders.push(genderInput[i].textContent)
    }
    
    
    const dot1 = document.querySelector('#dot-1')
    const dot2 = document.querySelector('#dot-2')
    const dot3 = document.querySelector('#dot-3')


    // const birthDate = birthDateInput.value

    
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
    document.querySelectorAll('.input-box .border-danger').forEach(field => field.classList.remove('border-danger'))
    if (birthDateInput._flatpickr && birthDateInput._flatpickr.altInput) {
        birthDateInput._flatpickr.altInput.classList.remove('border-danger');
    }
    
    document.querySelectorAll('.text-danger').forEach(errotText => errotText.remove())

    if(fullName === ""){
        showError(fullNameInput, "Enter your Name")
    }
    if(userName === ""){
        showError(userNameInput, "Enter your Username")
    }

    if(!emailPattern.test(email)){
        showError(emailInput, "Enter a Valid Email Address")
    }

    if(isNaN(phone)){
        showError(phoneInput, "Enter a Valid Phone Number")
    }

    if(birthDate === ""){
        showError(birthDateInput, "Enter your Birth Date Correctly")
    }

    if(pictureInput.files.length === 0){
        showError(pictureInput, "Enter your Picture")
    }

    if(gendersRadio === null){
        radioError(genderTitle, "Please Select a Gender")
    }

    if(roleCheckBox === null){
        radioError(roleTitle, "Please Select your Role")
    }


    const errorInputs = document.querySelectorAll('.input-box .border-danger')
    console.log("2. Jumlah Error ditemukan: ", errorInputs.length);
    if(errorInputs.length > 0) {
        console.log("3. Validasi Gagal. Berhenti di sini.");
        return;
    }
        
        

    const selectedRoles = [];
    document.querySelectorAll('input[name="role"]:checked').forEach((checkbox) => {
        // Kita ambil teks dari elemen sibling <span> yang memiliki class .role
        const roleLabel = checkbox.closest('.checkbox').querySelector('.role').innerText;
        selectedRoles.push(roleLabel);
    });

    let selectedGender = "";
    if (gendersRadio) {
        const genderID = gendersRadio.id
        const label = document.querySelector('label[for="${genderID}"]');

        if(label) {
            selectedGender = label.querySelector('.gender').innerText;
        }
        
    }

    const formData = {
        fullName: fullName,
        username: userName,
        email: email,
        phone: phone,
        birthDate: birthDate,
        gender: selectedGender,
        roles: selectedRoles,
        picture: null // Nanti diisi setelah konversi gambar
    };

    const file = pictureInput.files[0];
    if (file) {
        console.log("5. File gambar ditemukan, sedang membaca...");
        const reader = new FileReader();
        
        // Event ini berjalan ketika gambar selesai dibaca
        reader.onload = function(e) {
            console.log("6. Gambar selesai dibaca (OnLoad fired)");
            const base64Image = e.target.result; // Ini string gambarnya
            formData.picture = base64Image;

            // SIMPAN KE LOCALSTORAGE (Konversi Object -> JSON String)
            localStorage.setItem('registrationData', JSON.stringify(formData));

            // REDIRECT KE HALAMAN SUKSES
            window.location.href = 'success.html';
        };

        reader.readAsDataURL(file);
    } else {
        // Fallback jika entah kenapa tidak ada gambar (meski sudah divalidasi)
        localStorage.setItem('registrationData', JSON.stringify(formData));
        window.location.href = 'success.html';
        console.log("5B. File gambar tidak terdeteksi objectnya (Aneh).");
    }

    // form.submit()
}

form.addEventListener('submit', handleSubmit)

pictureInput.addEventListener('change', function(){
    if(this.files.length > 0) {
        this.classList.add('has-file')

        this.classList.remove('border-danger'); 
        const container = this.closest('.input-box');
        const errorMsg = container.querySelector('.text-danger');
        if (errorMsg) errorMsg.remove();
    } else {
        this.classList.remove('has-file')
    }
})

document.querySelectorAll('.input-box input').forEach(input => {
    const updateInputState = (field) => {
        if (field.value.trim() !== "") {
            field.classList.add('has-text'); // Tambah class penanda
        } else {
            field.classList.remove('has-text'); // Hapus class
        }
    };

    input.addEventListener('input', function() {
        this.classList.remove('border-danger');
        const container = this.closest('.input-box');
        const errorMsg = container.querySelector('.text-danger');
        if (errorMsg) errorMsg.remove();

        updateInputState(this);
    });

    updateInputState(input);
});

if(birthDateInput._flatpickr) {
    birthDateInput._flatpickr.config.onChange.push(function() {
        birthDateInput._flatpickr.altInput.classList.remove('border-danger');
        const container = birthDateInput.closest('.input-box');
        const errorMsg = container.querySelector('.text-danger');
        if (errorMsg) errorMsg.remove();
    });
}