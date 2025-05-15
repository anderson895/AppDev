<?php

include('config.php');
date_default_timezone_set('Asia/Manila');

class global_class extends db_connect
{
    public function __construct()
    {
        $this->connect();
    }

    public function save_order_details($customerName, $shippingAddress, $total)
    {
        $query = $this->conn->prepare("
            INSERT INTO `orders` (`order_name`, `order_address`, `order_total`)
            VALUES (?, ?, ?)
        ");
        $query->bind_param("sss", $customerName, $shippingAddress, $total);

        if ($query->execute()) {
            $orderId = $this->conn->insert_id;  // ✅ Get the inserted order ID
            $query->close();
            return $orderId;  // ✅ Return order ID
        } else {
            $query->close();
            return false;
        }
    }

    public function save_order_items($orderId, $itemName, $itemPrice)
    {
        $query = $this->conn->prepare("
            INSERT INTO `order_item` (`order_item_order_id`, `order_item_product`, `order_item_price`)
            VALUES (?, ?, ?)
        ");
        $query->bind_param("iss", $orderId, $itemName, $itemPrice); // orderId is int, others are strings

        if ($query->execute()) {
            $query->close();
            return true;
        } else {
            $query->close();
            return false;
        }
    }
}
