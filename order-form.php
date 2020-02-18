<?php
/**
    Plugin Name: Order form
**/

function cof_build_form() {
    return file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/order-form/index.php');
}

function cof_add_scripts() {
    wp_enqueue_script('cof_vendor_script', '/wp-content/plugins/order-form/assets/js/vendor.js');
    wp_enqueue_script('cof_main_script', '/wp-content/plugins/order-form/assets/js/custom.js', array('cof_vendor_script'));
}

function cof_add_styles() {
    wp_register_style('cof-style', '/wp-content/plugins/order-form/assets/styles.css');
    wp_enqueue_style('cof-style');
}

add_action('wp_enqueue_scripts', 'cof_add_scripts');
add_action('wp_enqueue_scripts', 'cof_add_styles');
add_shortcode('order-form', 'cof_build_form');
