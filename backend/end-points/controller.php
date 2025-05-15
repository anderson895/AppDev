<?php
include('../class.php');

$db = new global_class();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['requestType']) && $_POST['requestType'] === 'CheckOutOrder') {

        $customerName = $_POST['customerName'];
        $shippingAddress = $_POST['shippingAddress'];
        $total = $_POST['total'];
        $items = json_decode($_POST['items'], true);

        // Save order details and get the order ID
        $orderId = $db->save_order_details($customerName, $shippingAddress, $total);

        if (!$orderId) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to save order details.']);
            exit;
        }

        // Save each item with the order ID
        foreach ($items as $item) {
            $itemName = $item['item'];
            $itemPrice = $item['price'];

            $result = $db->save_order_items($orderId, $itemName, $itemPrice);

            if (!$result) {
                echo json_encode(['status' => 'error', 'message' => 'Failed to save order item: ' . $itemName]);
                exit;
            }
        }

        // If all went well
        echo json_encode(['status' => 'success', 'message' => 'Order received!']);

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
    }
}
?>
