<?php
session_start();
require_once '../config/db.php';

if (!isset($_SESSION['admin_id'])) {
    header("Location: ../admin.php");
    exit();
}

if (isset($_GET['id'])) {
    // Get the app details to delete the icon file
    $stmt = $pdo->prepare("SELECT icon_path FROM apps WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $app = $stmt->fetch();

    if ($app && $app['icon_path']) {
        $icon_path = '../' . $app['icon_path'];
        if (file_exists($icon_path)) {
            unlink($icon_path);
        }
    }

    // Delete the app from database
    $stmt = $pdo->prepare("DELETE FROM apps WHERE id = ?");
    $stmt->execute([$_GET['id']]);
}

header("Location: dashboard.php");
exit();