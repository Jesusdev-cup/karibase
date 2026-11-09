<?php
/**
 * Plugin Name: Karibase
 * Description: WordPress base layer for the Karibase design system. Enqueues shared CSS/JS and exposes PHP helpers for team plugins.
 * Version: 2.1.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Karibase
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: karibase
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'KARIBASE_VERSION', '2.1.0' );
define( 'KARIBASE_DIR', plugin_dir_path( __FILE__ ) );
define( 'KARIBASE_URL', plugin_dir_url( __FILE__ ) );

/**
 * Cache-bust assets using filemtime. Falls back to KARIBASE_VERSION if the file does not exist.
 *
 * @param string $relative_path Path relative to the plugin root, e.g. 'src/styles/karibase.css'.
 * @return string Cache-busting version.
 */
function karibase_asset_version( $relative_path = '' ) {
	static $cache = array();

	if ( ! $relative_path ) {
		return KARIBASE_VERSION;
	}

	$relative_path = ltrim( $relative_path, '/\\' );
	if ( isset( $cache[ $relative_path ] ) ) {
		return $cache[ $relative_path ];
	}

	$file = wp_normalize_path( KARIBASE_DIR . $relative_path );
	if ( is_file( $file ) && is_readable( $file ) ) {
		$cache[ $relative_path ] = (string) filemtime( $file );
	} else {
		$cache[ $relative_path ] = KARIBASE_VERSION;
	}

	return $cache[ $relative_path ];
}

require_once KARIBASE_DIR . 'includes/class-karibase-wp.php';

function karibase_wp_load() {
	Karibase_WP::instance();
}
add_action( 'plugins_loaded', 'karibase_wp_load' );

/**
 * Enqueue a generated ARC kit theme (src/styles/themes/karibase-theme-{slug}.css).
 *
 * @param string $slug Kit slug, e.g. 'nomad'.
 * @return bool
 */
function karibase_enqueue_theme( $slug ) {
	return Karibase_WP::instance()->enqueue_theme( $slug );
}

/**
 * Enqueue all authored styles extracted from a team plugin.
 *
 * @param string $slug Plugin slug, e.g. 'ix-projects'.
 * @return int Styles enqueued.
 */
function karibase_enqueue_plugin_styles( $slug ) {
	return Karibase_WP::instance()->enqueue_plugin_styles( $slug );
}
