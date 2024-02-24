<?php

function validateFormFields($first_name, $last_name, $email, $phone, $message, $resume) {

    $errors = [];

    if (empty($first_name)) {
        $errors['first_name'] = 'First name is required.';
    }
    if (empty($last_name)) {
        $errors['last_name'] = 'Last name is required.';
    }
    if (empty($email)) {
        $errors['email'] = 'Email is required.';
    }
    if (empty($phone)) {
        $errors['phone'] = 'Phone is required.';
    }
    if (empty($message)) {
        $errors['message'] = 'Message is required.';
    }
    if (empty($resume['name'])) {
        $errors['resume'] = 'Resume file is required.';
    }

    // Validate resume file type
    $allowedExtensions = ['application/pdf'];
    if (!in_array($resume['type'], $allowedExtensions)) {
        $errors['resume'] = 'Only PDF files are allowed';
    }

    return $errors;
}


