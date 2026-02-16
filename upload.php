<?php
// Configurar CORS
header('Access-Control-Allow-Origin: https://www.ultrasystem.shop');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json');

// Ruta del log
$logFile = __DIR__ . '/upload_log.txt';
file_put_contents($logFile, "=== Nueva solicitud ===\n", FILE_APPEND);

// Manejar solicitud OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    file_put_contents($logFile, "[INFO] Solicitud OPTIONS recibida\n", FILE_APPEND);
    http_response_code(200);
    exit();
}

$response = ['success' => false, 'error' => ''];

try {
    // 1. Verificar método
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        file_put_contents($logFile, "[ERROR] Método no permitido: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);
        throw new Exception('Método no permitido', 405);
    }
    file_put_contents($logFile, "[INFO] Método POST recibido\n", FILE_APPEND);

    // 2. Verificar si se envió un archivo
    if (empty($_FILES['image'])) {
        file_put_contents($logFile, "[ERROR] No se recibió ninguna imagen\n", FILE_APPEND);
        throw new Exception('No se recibió ninguna imagen', 400);
    }
    file_put_contents($logFile, "[INFO] Archivo recibido: " . print_r($_FILES['image'], true) . "\n", FILE_APPEND);

    $file = $_FILES['image'];

    // 3. Validar errores de subida
    if ($file['error'] !== UPLOAD_ERR_OK) {
        file_put_contents($logFile, "[ERROR] Error en la subida: " . $file['error'] . "\n", FILE_APPEND);
        throw new Exception('Error al subir el archivo: ' . $file['error'], 400);
    }

    // 4. Validar tipo MIME
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    file_put_contents($logFile, "[INFO] Tipo MIME detectado: $mime\n", FILE_APPEND);

    if (!in_array($mime, $allowedTypes)) {
        file_put_contents($logFile, "[ERROR] Tipo de archivo no permitido: $mime\n", FILE_APPEND);
        throw new Exception('Tipo de archivo no permitido', 400);
    }

    // 5. Validar tamaño (máximo 30MB)
    $maxSize = 30 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        file_put_contents($logFile, "[ERROR] Archivo demasiado grande: " . $file['size'] . "\n", FILE_APPEND);
        throw new Exception('El archivo es demasiado grande (máximo 30MB)', 400);
    }

    // 6. Crear directorio de subida si no existe
    $uploadDir = '/home/u100171750/domains/ultrasystem.shop/public_html/uploads/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            file_put_contents($logFile, "[ERROR] No se pudo crear el directorio: $uploadDir\n", FILE_APPEND);
            throw new Exception('No se pudo crear el directorio de destino', 500);
        }
        file_put_contents($logFile, "[INFO] Directorio creado: $uploadDir\n", FILE_APPEND);
    }

    // 7. Generar nombre único y mover archivo
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'img_' . uniqid() . '.' . $extension;
    $destination = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        file_put_contents($logFile, "[ERROR] Error al mover archivo a: $destination\n", FILE_APPEND);
        throw new Exception('Error al guardar el archivo', 500);
    }

    // 8. Construir URL de respuesta
    $imageUrl = 'https://ultrasystem.shop/uploads/' . $filename;
    $response = [
        'success' => true,
        'imageUrl' => $imageUrl,
        'filename' => $filename
    ];
    file_put_contents($logFile, "[SUCCESS] Imagen subida exitosamente: $imageUrl\n", FILE_APPEND);

} catch (Exception $e) {
    $code = $e->getCode() ?: 500;
    http_response_code($code);
    $response['error'] = $e->getMessage();
    file_put_contents($logFile, "[EXCEPTION] " . $e->getMessage() . "\n", FILE_APPEND);
}

echo json_encode($response);
?>