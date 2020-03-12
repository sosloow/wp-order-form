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
    $order = $request->get_json_params();
    // $email = 's.shilin@cuberto.ru';
    $email = 'silversalt@mail.ru';
    $subject = 'Новый заказ';

    $text = "Имя: ".$order['name']."\nНомер телефона: ".$order['phone']."\nEmail: ".$order['email']."\n\nЗаказ:".build_order_items_list($order)."\n\nИтог: ".$order['total'].' руб.';

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

function build_order_items_list($order) {
    if (!$order['items']) {
        return '';
    }

    $PRODUCTS = array(
      'ag99' => 'Ag 99,99',
      'agcu925' => 'AgCu 92,5',
      'agcu72' => 'AgCu 72'
    );

    $text = '';
    foreach($order['items'] as $item) {
        $text = $text."\n".$PRODUCTS[$item['product']].', диаметр: '.$item['width'].'мм, вес: '.$item['weight'].'г'.($item['length'] ? ', длина: '.$item['length'].'м' : '');
    }

    return $text;
}