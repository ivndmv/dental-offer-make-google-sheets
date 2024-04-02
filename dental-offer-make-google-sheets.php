<?php
/*
Plugin Name:  Dental offer maker
Description:  Dental offer maker that uses google sheets price data
Version:      1.0
Author:       Ivan Dimitrov
*/

add_action( 'wp_enqueue_scripts', 'add_scripts', 999 ); 
function add_scripts() {
    wp_enqueue_style( 'dogs-plugin-style', plugins_url('/css/style.css', __FILE__), array(), '1.1', 'all' );
	wp_enqueue_script( 'dogs-plugin-script', plugins_url('/js/calc.js', __FILE__), array( 'jquery' ), 1.1, true );
} 

// include plugins_url('../calculator.php', __FILE__);
include 'calculator.php';


?>