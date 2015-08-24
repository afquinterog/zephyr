<?php

// Switch off Otimized JS option for Ultimate Addons, so its JS will load after ours
if ( class_exists( 'Ultimate_VC_Addons' ) ) {
	add_action( 'admin_init', 'us_ultimate_addons_for_vc_integration' );
	function us_ultimate_addons_for_vc_integration() {
		if ( get_option( 'ultimate_js' ) ) {
			if ( get_option( 'ultimate_js' ) === '' OR get_option( 'ultimate_js' ) === 'enable' ) {
				update_option( 'ultimate_js', 'disable' );
			}
		} else {
			update_option( 'ultimate_js', 'disable' );
		}
		if ( get_option( 'ultimate_updater' ) != 'disabled' ) {
			update_option( 'ultimate_updater', 'disabled' );
		}
	}
}

// Redirect to Demo Import page after Theme activation

add_action( 'admin_init', 'us_theme_activation' );
function us_theme_activation() {
	global $pagenow;
	if ( is_admin() AND $pagenow == 'themes.php' AND isset( $_GET['activated'] ) ) {
		//Set menu
		$user = wp_get_current_user();
		update_user_option( $user->ID, 'zephyr_cpt_in_menu_set', FALSE, TRUE );

		//Redirect to demo import
		header( 'Location: ' . admin_url() . 'admin.php?page=us-home' );
	}
}

add_action( 'admin_head', 'us_include_cpt_to_menu', 99 );
function us_include_cpt_to_menu() {
	global $pagenow;
	if ( is_admin() AND $pagenow == 'nav-menus.php' ) {
		$already_set = get_user_option( 'zephyr_cpt_in_menu_set' );

		if ( ! $already_set ) {
			$hidden_meta_boxes = get_user_option( 'metaboxhidden_nav-menus' );

			if ( $hidden_meta_boxes !== FALSE ) {
				if ( ( $key = array_search( 'add-us_portfolio', $hidden_meta_boxes ) ) !== FALSE ) {
					unset( $hidden_meta_boxes[ $key ] );
				}
				if ( ( $key = array_search( 'add-us_portfolio_category', $hidden_meta_boxes ) ) === FALSE ) {
					$hidden_meta_boxes[] = 'add-us_portfolio_category';
				}
				if ( ( $key = array_search( 'add-us_client', $hidden_meta_boxes ) ) === FALSE ) {
					$hidden_meta_boxes[] = 'add-us_client';
				}

				$user = wp_get_current_user();
				update_user_option( $user->ID, 'metaboxhidden_nav-menus', $hidden_meta_boxes, TRUE );
				update_user_option( $user->ID, 'zephyr_cpt_in_menu_set', TRUE, TRUE );
			}
		}
	}
}

// TinyMCE buttons
add_action( 'admin_print_scripts', 'us_enqueue_admin_css', 12 );
function us_enqueue_admin_css() {
	global $us_template_directory_uri;
	wp_enqueue_style( 'us-theme-admin', $us_template_directory_uri . '/framework/css/admin/theme-admin.css' );
	wp_enqueue_style( 'us-js-composer', $us_template_directory_uri . '/framework/css/admin/js_composer.css' );
	wp_enqueue_style( 'us-metabox', $us_template_directory_uri . '/framework/css/admin/metabox.css ' );
}

