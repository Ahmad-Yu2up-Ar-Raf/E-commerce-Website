<?php
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
// Pastikan file ini ada di direktori root proyek kamu
require __DIR__ . '/../vendor/autoload.php';  // Pastikan path ini benar

// Menggunakan dotenv untuk membaca file .env
use Dotenv\Dotenv;

// Membaca file .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Mengambil kunci Midtrans dari .env
$clientKey = $_ENV['MIDTRANS_CLIENT_KEY'];
$serverKey = $_ENV['MIDTRANS_SERVER_KEY'];

// Mengonfigurasi Midtrans dengan server key
\Midtrans\Config::$serverKey = $serverKey;
\Midtrans\Config::$isProduction = false;  // Gunakan true untuk produksi
\Midtrans\Config::$isSanitized = true;
\Midtrans\Config::$is3ds = true;

// Validasi input POST yang diterima
if (!isset($_POST['total']) || !isset($_POST['items']) || !isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone'])) {
    die('Data transaksi tidak lengkap!');
}

// Sample request untuk transaksi
$params = array(
    'transaction_details' => array(
        'order_id' => rand(),  // Order ID yang bisa di-generate secara acak atau menggunakan ID unik lainnya
        'gross_amount' => $_POST['total'],
    ),
    'item_details' => json_decode($_POST['items'], true),
    'customer_details' => array(
        'first_name' => $_POST['name'],
        'email' => $_POST['email'],
        'phone' => $_POST['phone'],
    ),
);

try {
    // Mendapatkan snap token
    $snapToken = \Midtrans\Snap::getSnapToken($params);

    // Mengirimkan snap token ke frontend
    echo $snapToken;

} catch (Exception $e) {
    // Menangani error jika terjadi kesalahan
    echo 'Terjadi kesalahan: ' . $e->getMessage();
}
?>
