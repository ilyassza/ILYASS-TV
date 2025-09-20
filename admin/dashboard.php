<?php
session_start();
require_once '../config/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../admin.php");
    exit();
}

// Fetch all apps
$stmt = $pdo->query("SELECT * FROM apps ORDER BY created_at DESC");
$apps = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - ILYASS TV</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1 class="dashboard-title">لوحة التحكم</h1>
            <div>
                <button onclick="window.location.href='add_app.php'" class="btn btn-edit">
                    <i class="fas fa-plus"></i> إضافة تطبيق جديد
                </button>
                <button onclick="window.location.href='logout.php'" class="btn btn-delete">
                    <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                </button>
            </div>
        </div>

        <div class="app-grid">
            <?php foreach ($apps as $app): ?>
                <div class="app-card">
                    <img src="<?php echo htmlspecialchars($app['icon_path']); ?>" alt="<?php echo htmlspecialchars($app['name']); ?>">
                    <h3><?php echo htmlspecialchars($app['name']); ?></h3>
                    <div class="rating">
                        <?php
                        $rating = round($app['rating']);
                        for ($i = 1; $i <= 5; $i++) {
                            if ($i <= $rating) {
                                echo '<i class="fas fa-star"></i>';
                            } else {
                                echo '<i class="far fa-star"></i>';
                            }
                        }
                        ?>
                    </div>
                    <p><?php echo htmlspecialchars($app['description']); ?></p>
                    <div class="app-actions">
                        <button onclick="window.location.href='edit_app.php?id=<?php echo $app['id']; ?>'" class="btn btn-edit">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button onclick="deleteApp(<?php echo $app['id']; ?>)" class="btn btn-delete">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <script>
    function deleteApp(appId) {
        if (confirm('هل أنت متأكد من حذف هذا التطبيق؟')) {
            window.location.href = 'delete_app.php?id=' + appId;
        }
    }
    </script>
</body>
</html>