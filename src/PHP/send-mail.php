<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\OAuth;
use League\OAuth2\Client\Provider\Google;

require_once '../vendor/autoload.php';
require_once 'class-db.php';
require_once 'validate.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Get request data
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $senderEmail = $_POST['email'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];
    $resume = $_FILES['resume'];

    $errors = validateFormFields($first_name, $last_name, $senderEmail, $phone, $message, $resume);

    if (empty($errors)) {
        // File handling - Check if the resume file was successfully uploaded
        if ($resume['error'] === UPLOAD_ERR_OK) {
            // File handling
            $uploadedFile = $_FILES['resume']['tmp_name'];
            $fileName = $_FILES['resume']['name'];

            $email = 'your@email.com'; // the email used to register google app
            $clientId = 'your_ID';
            $clientSecret = 'your_secret';

            $db = new DB();
            $refreshToken = $db->get_refresh_token();

            //Create a new OAuth2 provider instance
            $provider = new Google([
                'clientId' => $clientId,
                'clientSecret' => $clientSecret,
            ]);

            $mail = new PHPMailer(true); // new PHPMailer instance, passing `true` enables exceptions
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->Port = 587;
            // Set the encryption mechanism to use:
            // SMTPS (implicit TLS on port 465) or
            // STARTTLS (explicit TLS on port 587)
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->SMTPAuth = true;
            $mail->AuthType = 'XOAUTH2';

            //Pass the OAuth provider instance to PHPMailer
            $mail->setOAuth(new OAuth([
                'provider' => $provider,
                'clientId' => $clientId,
                'clientSecret' => $clientSecret,
                'refreshToken' => $refreshToken,
                'userName' => $email,
            ]));

            // Attach resume
            $mail->addAttachment($uploadedFile, $fileName);
            // Set email content
            $mail->setFrom($senderEmail, $first_name, $last_name);
            $mail->addAddress('the@recipient.com', 'their_name');
            $mail->isHTML(true);
            $mail->Subject = 'Email_Subject';
            $mail->Body = "<p><b>Name:</b> $first_name $last_name</p>" .
                          "<p><b>Email:</b> $senderEmail</p>" .
                          "<p><b>Message:</b> $message <br> Phone: $phone </p>";

            // Send the message, check for errors
            if ($mail->send()) {
                echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Email failed']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error uploading resume']);
        }
    } else {
        // If there are validation errors, return them to the frontend
        echo json_encode(['success' => false, 'errors' => $errors]);
    }
}


