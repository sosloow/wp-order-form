<?php
/**
    Plugin Name: Order form
**/
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );

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

// order form
function create_new_order($request) {
    $email = 's.shilin@cuberto.ru';
    $subject = 'Новый заказ';

    $text = "Имя: ".$request->name."\nНомер телефона: ".$request->phone."\nEmail: ".$request->email;

    $result = wp_mail(
        $email,
        $subject,
        $text
    );

    return new WP_REST_response('success', 200);
}

add_action('rest_api_init', function () {
  register_rest_route( 'beta/v1', '/orders', array(
    'methods' => 'POST',
    'callback' => 'create_new_order',
  ));
});
