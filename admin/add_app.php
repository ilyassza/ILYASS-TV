<?php
session_start();
require_once '../config/db.php';

if (!isset($_SESSION['admin_id'])) {
    header("Location: ../admin.php");
    exit();
}

$isEdit = false;
$app = [
    'name' => '',
    'description' => '',
    'download_link' => '',
    'rating' => 0,
    'icon_path' => ''
];

if (isset($_GET['id'])) {
    $isEdit = true;
    $stmt = $pdo->prepare("SELECT * FROM apps WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $app = $stmt->fetch();

    if (!$app) {
        header("Location: dashboard.php");
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $description = $_POST['description'];
    $download_link = $_POST['download_link'];
    $rating = $_POST['rating'];

    // Handle file upload
    $icon_path = $app['icon_path'];
    if (isset($_FILES['icon']) && $_FILES['icon']['error'] === 0) {
        $upload_dir = '../uploads/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_extension = pathinfo($_FILES['icon']['name'], PATHINFO_EXTENSION);
        $file_name = uniqid() . '.' . $file_extension;
        $target_path = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES['icon']['tmp_name'], $target_path)) {
            $icon_path = 'uploads/' . $file_name;
        }
    }

    if ($isEdit) {
        $stmt = $pdo->prepare("UPDATE apps SET name = ?, description = ?, download_link = ?, icon_path = ?, rating = ? WHERE id = ?");
        $stmt->execute([$name, $description, $download_link, $icon_path, $rating, $_GET['id']]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO apps (name, description, download_link, icon_path, rating) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $description, $download_link, $icon_path, $rating]);
    }

    header("Location: dashboard.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $isEdit ? 'تعديل تطبيق' : 'إضافة تطبيق جديد'; ?> - ILYASS TV</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1><?php echo $isEdit ? 'تعديل تطبيق' : 'إضافة تطبيق جديد'; ?></h1>
        </div>

        <form class="app-form" method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label for="name">اسم التطبيق</label>
                <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($app['name']); ?>" required>
            </div>

            <div class="form-group">
                <label for="description">وصف التطبيق</label>
                <textarea id="description" name="description" required><?php echo htmlspecialchars($app['description']); ?></textarea>
            </div>

            <div class="form-group">
                <label for="download_link">رابط التحميل</label>
                <input type="url" id="download_link" name="download_link" value="<?php echo htmlspecialchars($app['download_link']); ?>" required>
            </div>

            <div class="form-group">
                <label for="rating">التقييم (1-5)</label>
                <input type="number" id="rating" name="rating" min="0" max="5" step="0.5" value="<?php echo htmlspecialchars($app['rating']); ?>" required>
            </div>

            <div class="form-group">
                <label for="icon">أيقونة التطبيق</label>
                <?php if ($app['icon_path']): ?>
                    <img src="<?php echo htmlspecialchars($app['icon_path']); ?>" alt="Current icon" style="width: 100px; height: 100px; object-fit: contain; margin: 10px 0;">
                <?php endif; ?>
                <input type="file" id="icon" name="icon" accept="image/*" <?php echo $isEdit ? '' : 'required'; ?>>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-edit"><?php echo $isEdit ? 'حفظ التغييرات' : 'إضافة التطبيق'; ?></button>
                <button type="button" onclick="window.location.href='dashboard.php'" class="btn btn-delete">إلغاء</button>
            </div>
        </form>
    </div>
</body>
</html>