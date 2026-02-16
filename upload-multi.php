<?php
header('Access-Control-Allow-Origin: https://www.ultrasystem.shop');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json');

// Manejar solicitud OPTIONS para CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = ['success' => false, 'error' => '', 'imageUrls' => []];

try {
    // Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    // Verificar si se enviaron archivos
    if (empty($_FILES['images'])) {
        throw new Exception('No se recibieron imágenes', 400);
    }

    // Validar cantidad de archivos (máximo 4)
    if (count($_FILES['images']['name']) > 6) {
        throw new Exception('Máximo 6 imágenes permitidas', 400);
    }

    // Directorio de subida en Hostinger
    $uploadDir = '/home/u100171750/domains/ultrasystem.shop/public_html/uploads/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('No se pudo crear el directorio de destino', 500);
        }
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 30 * 1024 * 1024; // 30MB
    $uploadedFiles = [];

    // Procesar cada archivo
    foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
        $fileName = $_FILES['images']['name'][$key];
        $fileSize = $_FILES['images']['size'][$key];
        $fileType = $_FILES['images']['type'][$key];
        $fileError = $_FILES['images']['error'][$key];

        // Validar errores de subida
        if ($fileError !== UPLOAD_ERR_OK) {
            throw new Exception("Error al subir el archivo $fileName", 400);
        }

        // Validar tipo de archivo
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $tmpName);
        finfo_close($finfo);
        
        if (!in_array($mime, $allowedTypes)) {
            throw new Exception("Tipo de archivo no permitido: $fileName", 400);
        }

        // Validar tamaño de archivo
        if ($fileSize > $maxSize) {
            throw new Exception("Archivo demasiado grande: $fileName (máximo 30MB)", 400);
        }

        // Generar nombre único
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        $newFilename = 'img_' . uniqid() . '_' . $key . '.' . $extension;
        $destination = $uploadDir . $newFilename;

        // Mover el archivo
        if (!move_uploaded_file($tmpName, $destination)) {
            throw new Exception("Error al guardar el archivo: $fileName", 500);
        }

        $uploadedFiles[] = 'https://ultrasystem.shop/uploads/' . $newFilename;
    }

    $response = [
        'success' => true,
        'imageUrls' => $uploadedFiles,
        'message' => count($uploadedFiles) . ' imágenes subidas correctamente'
    ];

} catch (Exception $e) {
    // Eliminar archivos subidos parcialmente en caso de error
    if (!empty($uploadedFiles)) {
        foreach ($uploadedFiles as $fileUrl) {
            $filePath = str_replace('https://ultrasystem.shop/uploads/', $uploadDir, $fileUrl);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
    }

    http_response_code($e->getCode() ?: 500);
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
?>