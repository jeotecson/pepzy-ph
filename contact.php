<?php
header('Content-Type: application/json; charset=utf-8');

function respond($ok, $payload = []) {
  echo json_encode(array_merge(['ok' => $ok], $payload));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(false, ['error' => 'Invalid method']);
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? 'Website Inquiry');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
  respond(false, ['error' => 'Missing required fields']);
}

// Basic header injection protection
if (preg_match('/\r|\n/', $name) || preg_match('/\r|\n/', $email) || preg_match('/\r|\n/', $subject)) {
  respond(false, ['error' => 'Header injection detected']);
}

$to = 'jeotecson13@gmail.com';
$mailSubject = "Website Contact: " . ($subject ?: 'No subject');

$body = "You have a new message from the website contact form:\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Subject: {$subject}\n\n";
$body .= "Message:\n{$message}\n";

$from = 'Pepzy Website <no-reply@pepzy.com>';
$headers = [];
$headers[] = 'From: ' . $from;
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = false;
$method = 'mail';

// If RESEND_API_KEY is set in environment, try Resend API first (more reliable than local mail()).
$resendKey = getenv('RESEND_API_KEY');
if ($resendKey) {
  $payload = [
    'from' => 'Pepzy Website <contact@pepzy.com>',
    'to' => [$to],
    'subject' => $mailSubject,
    'html' => nl2br(htmlspecialchars($body, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')),
  ];

  $ch = curl_init('https://api.resend.com/emails');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $resendKey,
  ]);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
  $resp = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $curlErr = curl_error($ch);
  curl_close($ch);

  if ($resp !== false && in_array($httpCode, [200,201,202])) {
    $sent = true;
    $method = 'resend';
  } else {
    // log for debugging in server logs
    error_log('Resend send failed: HTTP ' . $httpCode . ' resp=' . $resp . ' err=' . $curlErr);
  }
}

// Fallback to PHP mail() if Resend not configured or failed
if (! $sent) {
  try {
    $sent = @mail($to, $mailSubject, $body, implode("\r\n", $headers));
    $method = 'mail';
  } catch (Exception $e) {
    error_log('PHP mail() exception: ' . $e->getMessage());
  }
}

respond(true, ['sent' => (bool)$sent, 'method' => $method]);

?>
