<?php
/**
 * Contact Form Handler
 * Processes contact form submissions with validation, sanitization, and database storage
 * Returns JSON responses for AJAX handling
 */

// Start session for CSRF token verification
session_start();

// Set content type to JSON
header('Content-Type: application/json');

// Enable error logging to file
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/errors.log');

// ============================================
// DATABASE CONFIGURATION
// ============================================

// Database credentials - UPDATE THESE WITH YOUR ACTUAL VALUES
define('DB_HOST', 'localhost');
define('DB_NAME', 'contact_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Send JSON response and exit
 * @param bool $success - Success status
 * @param string $message - Response message
 * @param array $data - Additional data (optional)
 */
function sendResponse($success, $message, $data = []) {
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message
    ], $data));
    exit;
}

/**
 * Log error to file
 * @param string $message - Error message to log
 */
function logError($message) {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}\n";
    error_log($logMessage, 3, __DIR__ . '/../logs/errors.log');
}

/**
 * Validate CSRF token
 * @param string $token - Token to validate
 * @return bool - True if valid, false otherwise
 */
function validateCSRFToken($token) {
    // In a production environment, compare with server-side generated token
    // For this example, we'll do basic validation
    if (empty($token)) {
        return false;
    }
    
    // Token should be alphanumeric and of reasonable length
    if (!preg_match('/^[a-zA-Z0-9]{20,50}$/', $token)) {
        return false;
    }
    
    return true;
}

/**
 * Sanitize input data
 * @param string $data - Data to sanitize
 * @return string - Sanitized data
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email address
 * @param string $email - Email to validate
 * @return bool - True if valid, false otherwise
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ============================================
// MAIN PROCESSING
// ============================================

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Verify CSRF token
if (!isset($_POST['csrf_token']) || !validateCSRFToken($_POST['csrf_token'])) {
    logError('CSRF token validation failed');
    sendResponse(false, 'Security validation failed');
}

// Get and sanitize form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// ============================================
// SERVER-SIDE VALIDATION
// ============================================

$errors = [];

// Validate name
if (empty($name)) {
    $errors[] = 'Name is required';
} elseif (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters';
} elseif (strlen($name) > 100) {
    $errors[] = 'Name must not exceed 100 characters';
}

// Validate email
if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!validateEmail($email)) {
    $errors[] = 'Invalid email address';
} elseif (strlen($email) > 150) {
    $errors[] = 'Email must not exceed 150 characters';
}

// Validate subject
if (empty($subject)) {
    $errors[] = 'Subject is required';
} elseif (strlen($subject) < 3) {
    $errors[] = 'Subject must be at least 3 characters';
} elseif (strlen($subject) > 150) {
    $errors[] = 'Subject must not exceed 150 characters';
}

// Validate message
if (empty($message)) {
    $errors[] = 'Message is required';
} elseif (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
} elseif (strlen($message) > 2000) {
    $errors[] = 'Message must not exceed 2000 characters';
}

// If validation errors exist, return them
if (!empty($errors)) {
    sendResponse(false, implode(', ', $errors));
}

// ============================================
// DATABASE CONNECTION & INSERTION
// ============================================

try {
    // Create PDO connection with error mode set to exception
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    // Prepare SQL statement with placeholders to prevent SQL injection
    $sql = "INSERT INTO contacts (name, email, subject, message, created_at) 
            VALUES (:name, :email, :subject, :message, NOW())";
    
    $stmt = $pdo->prepare($sql);
    
    // Bind parameters
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':subject', $subject, PDO::PARAM_STR);
    $stmt->bindParam(':message', $message, PDO::PARAM_STR);
    
    // Execute the statement
    if ($stmt->execute()) {
        // Get the inserted ID
        $insertId = $pdo->lastInsertId();
        
        // Log success
        logError("Contact form submitted successfully. ID: {$insertId}, Email: {$email}");
        
        // Send success response
        sendResponse(true, 'Thank you for your message! We will get back to you soon.', [
            'id' => $insertId
        ]);
    } else {
        throw new Exception('Failed to insert data');
    }
    
} catch (PDOException $e) {
    // Log database error
    logError("Database error: " . $e->getMessage());
    
    // Send generic error message to user (don't expose database details)
    sendResponse(false, 'A database error occurred. Please try again later.');
    
} catch (Exception $e) {
    // Log general error
    logError("Error: " . $e->getMessage());
    
    // Send error response
    sendResponse(false, 'An error occurred while processing your request. Please try again.');
}

// Close database connection
$pdo = null;
?>
