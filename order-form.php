<?php
/**
    Plugin Name: Order form
**/

function cof_build_form() {
    return file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/order-form/form/index.php');
}

add_shortcode('order-form', 'cof_build_form');
