( function() {

if ( !jQuery.fn.offset ) {
	return;
}

var supportsScroll, supportsFixedPosition,
	forceScroll = jQuery( "<div/>" ).css( { width: 2000, height: 2000 } ),
	checkSupport = function() {

		// Only run once
		checkSupport = false;

		var checkFixed = jQuery( "<div/>" ).css( { position: "fixed", top: "20px" } ).appendTo( "#qunit-fixture" );

		// Must append to body because #qunit-fixture is hidden and elements inside it don't have a scrollTop
		forceScroll.appendTo( "body" );
		window.scrollTo( 200, 200 );
		supportsScroll = document.documentElement.scrollTop || document.body.scrollTop;
		forceScroll.detach();

		supportsFixedPosition = checkFixed[ 0 ].offsetTop === 20;
		checkFixed.remove();
	};

QUnit.module( "offset", { setup: function() {
	if ( typeof checkSupport === "function" ) {
		checkSupport();
	}

	// Force a scroll value on the main window to ensure incorrect results
	// if offset is using the scroll offset of the parent window
	forceScroll.appendTo( "body" );
	window.scrollTo( 1, 1 );
	forceScroll.detach();
}, teardown: moduleTeardown } );

QUnit.test( "empty set", function( assert ) {
	assert.expect( 2 );
	assert.strictEqual( jQuery().offset(), undefined, "offset() returns undefined for empty set (#11962)" );
	assert.strictEqual( jQuery().position(), undefined, "position() returns undefined for empty set (#11962)" );
} );

QUnit.test( "disconnected element", function( assert ) {
	assert.expect( 3 );

	var result = jQuery( document.createElement( "div" ) ).offset();

	// These tests are solely for master/compat consistency
	// Retrieving offset on disconnected/hidden elements is not officially
	// valid input, but will return zeros for back-compat
	assert.equal( result.top, 0, "Retrieving offset on disconnected elements returns zeros (gh-2310)" );
	assert.equal( result.left, 0, "Retrieving offset on disconnected elements returns zeros (gh-2310)" );
	assert.equal( Object.keys( result ).length, 2, "Retrieving offset on disconnected elements returns offset object (gh-3167)" );
} );

QUnit.test( "hidden (display: none) element", function( assert ) {
	assert.expect( 3 );

	var node = jQuery( "<div style='display: none' />" ).appendTo( "#qunit-fixture" ),
		result = node.offset();

	node.remove();

	// These tests are solely for master/compat consistency
	// Retrieving offset on disconnected/hidden elements is not officially
	// valid input, but will return zeros for back-compat
	assert.equal( result.top, 0, "Retrieving offset on hidden elements returns zeros (gh-2310)" );
	assert.equal( result.left, 0, "Retrieving offset on hidden elements returns zeros (gh-2310)" );
	assert.equal( Object.keys( result ).length, 2, "Retrieving offset on hidden elements returns offset object (gh-3167)" );
} );

QUnit.test( "0 sized element", function( assert ) {
	assert.expect( 3 );

	var node = jQuery( "<div style='margin: 5px; width: 0; height: 0' />" ).appendTo( "#qunit-fixture" ),
		result = node.offset();

	node.remove();

	assert.notEqual( result.top, 0, "Retrieving offset on 0 sized elements (gh-3167)" );
	assert.notEqual( result.left, 0, "Retrieving offset on 0 sized elements (gh-3167)" );
	assert.equal( Object.keys( result ).length, 2, "Retrieving offset on 0 sized elements returns offset object (gh-3167)" );
} );

QUnit.test( "hidden (visibility: hidden) element", function( assert ) {
	assert.expect( 3 );

	var node = jQuery( "<div style='margin: 5px; visibility: hidden' />" ).appendTo( "#qunit-fixture" ),
		result = node.offset();

	node.remove();

	assert.notEqual( result.top, 0, "Retrieving offset on visibility:hidden elements (gh-3167)" );
	assert.notEqual( result.left, 0, "Retrieving offset on visibility:hidden elements (gh-3167)" );
	assert.equal( Object.keys( result ).length, 2, "Retrieving offset on visibility:hidden elements returns offset object (gh-3167)" );
} );

testIframe( "absolute", "offset/absolute.html", function( assert, $, iframe ) {
	assert.expect( 4 );

	var doc = iframe.document,
			tests;

	// get offset
	tests = [
		{ "id": "#absolute-1", "top": 1, "left": 1 }
	];
	jQuery.each( tests, function() {
		assert.equal( jQuery( this.id, doc ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		assert.equal( jQuery( this.id, doc ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	} );

	// get position
	tests = [
		{ "id": "#absolute-1", "top": 0, "left": 0 }
	];
	jQuery.each( tests, function() {
		assert.equal( jQuery( this.id, doc ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		assert.equal( jQuery( this.id, doc ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	} );
} );

testIframe( "absolute", "offset/absolute.html", function( assert, $ ) {
	assert.expect( 178 );

	var tests, offset;

	// get offset tests
	tests = [
		{ "id": "#absolute-1",     "top":  1, "left":  1 },
		{ "id": "#absolute-1-1",   "top":  5, "left":  5 },
		{ "id": "#absolute-1-1-1", "top":  9, "left":  9 },
		{ "id": "#absolute-2",     "top": 20, "left": 20 }
	];
	jQuery.each( tests, function() {
		assert.equal( $( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		assert.equal( $( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	} );

	// get position
	tests = [
		{ "id": "#absolute-1",     "top":  0, "left":  0 },
		{ "id": "#absolute-1-1",   "top":  1, "left":  1 },
		{ "id": "#absolute-1-1-1", "top":  1, "left":  1 },
		{ "id": "#absolute-2",     "top": 19, "left": 19 }
	];
	jQuery.each( tests, function() {
		assert.equal( $( this.id ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		assert.equal( $( this.id ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	} );

	// test #5781
	offset = $( "#positionTest" ).offset( { "top": 10, "left": 10 } ).offset();
	assert.equal( offset.top,  10, "Setting offset on element with position absolute but 'auto' values." );
	assert.equal( offset.left, 10, "Setting offset on element with position absolute but 'auto' values." );

	// set offset
	tests = [
		{ "id": "#absolute-2",     "top": 30, "left": 30 },
		{ "id": "#absolute-2",     "top": 10, "left": 10 },
		{ "id": "#absolute-2",     "top": -1, "left": -1 },
		{ "id": "#absolute-2",     "top": 19, "left": 19 },
		{ "id": "#absolute-1-1-1", "top": 15, "left": 15 },
		{ "id": "#absolute-1-1-1", "top":  5, "left":  5 },
		{ "id": "#absolute-1-1-1", "top": -1, "left": -1 },
		{ "id": "#absolute-1-1-1", "top":  9, "left":  9 },
		{ "id": "#absolute-1-1",   "top": 10, "left": 10 },
		{ "id": "#absolute-1-1",   "top":  0, "left":  0 },
		{ "id": "#absolute-1-1",   "top": -1, "left": -1 },
		{ "id": "#absolute-1-1",   "top":  5, "left":  5 },
		{ "id": "#absolute-1",     "top":  2, "left":  2 },
		{ "id": "#absolute-1",     "top":  0, "left":  0 },
		{ "id": "#absolute-1",     "top": -1, "left": -1 },
		{ "id": "#absolute-1",     "top":  1, "left":  1 }
	];
	jQuery.each( tests, function() {
		$( this.id ).offset( { "top": this.top, "left": this.left } );
		assert.equal( $( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		assert.equal( $( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

		var top = this.top, left = this.left;

		$( this.id ).offset( function( i, val ) {
			assert.equal( val.top, top, "Verify incoming top position." );
			assert.equal( val.left, left, "Verify incoming top position." );
			return { "top": top + 1, "left": left + 1 };
		} );
		assert.equal( $( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + ( this.top  + 1 ) + " })" );
		assert.equal( $( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + ( this.left + 1 ) + " })" );

		$( this.id )
			.offset( { "left": this.left + 2 } )
			.offset( { "top":  this.top  + 2 } );
		assert.equal( $( this.id ).offset().top,  this.top  + 2, "Setting one property at a time." );
		assert.equal( $( this.id ).offset().left, this.left + 2, "Setting one property at a time." );

		$( this.id ).offset( { "top": this.top, "left": this.left, "using": function( props ) {
			$( this ).css( {
				"top":  props.top  + 1,
				"left": props.left + 1
			} );
		} } );
		assert.equal( $( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + ( this.top  + 1 ) + ", using: fn })" );
		assert.equal( $( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + ( this.left + 1 ) + ", using: fn })" );
	} );
} );

testIframe( "relative", "offset/relative.html", function( assert, $ ) {
	assert.expect( 64 );

	// get offset
	var tests = [
		{ "id": "#relative-1",   "top":   7, "left":  7 },
		{ "id": "#relative-1-1", "top":  15, "left": 15 },
		{ "id": "#relative-2",   "top": 142, "left": 27 },
		{ "id": "#relative-2-1",   "top": 149, "left": 52 }
	];
	jQuery.each( tests, function() {
		assert.equal( $( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		assert.equal( $( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	} );

	// get position
	tests = [
		{ "id": "#relative-1",   "top":   6, "left":  6 },
		{ "id": "#relative-1-1", "top":   5, "left":  5 },
		{ "id": "#relative-2",   "top": 141, "left": 26 },
		{ "id": "#relative-2-1",   "top": 5, "left": 5 }
	];
	jQuery.each( tests, function() {
		assert.equal( $( this.id ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		assert.equal( $( this.id ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	} );

	// set offset
	tests = [
		{ "id": "#relative-2",   "top": 200, "left":  50 },
		{ "id": "#relative-2",   "top": 100, "left":  10 },
		{ "id": "#relative-2",   "top":  -5, "left":  -5 },
		{ "id": "#relative-2",   "top": 142, "left":  27 },
		{ "id": "#relative-1-1", "top": 100, "left": 100 },
		{ "id": "#relative-1-1", "top":   5, "left":   5 },
		{ "id": "#relative-1-1", "top":  -1, "left":  -1 },
		{ "id": "#relative-1-1", "top":  15, "left":  15 },
		{ "id": "#relative-1",   "top": 100, "left": 100 },
		{ "id": "#relative-1",   "top":   0, "left":   0 },
		{ "id": "#relative-1",   "top":  -1, "left":  -1 },
		{ "id": "#relative-1",   "top":   7, "left":   7 }
	];
	jQuery.each( tests, function() {
		$( this.id ).offset( { "top": this.top, "left": this.left } );
		assert.equal( $( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		assert.equal( $( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

		$( this.id ).offset( { "top": this.top, "left": this.left, "using": function( props ) {
			$( this ).css( {
				"top":  props.top  + 1,
				"left": props.left + 1
			} );
		} } );
		assert.equal( $( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + ( this.top  + 1 ) + ", using: fn })" );
		assert.equal( $( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + ( this.left + 1 ) + ", using: fn })" );
	} );
} );

testIframe( "static", "offset/static.html", function( assert, $ ) {
	assert.expect( 80 );

	// get offset
	var tests = [
		{ "id": "#static-1",     "top":   7, "left":  7 },
		{ "id": "#static-1-1",   "top":  15, "left": 15 },
		{ "id": "#static-1-1-1", "top":  23, "left": 23 },
		{ "id": "#static-2",     "top": 122, left: 7 }
	];
	jQuery.each( tests, function() {
		assert.equal( $( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		assert.equal( $( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	} );

	// get position
	tests = [
		{ "id": "#static-1",     "top":   6, "left":  6 },
		{ "id": "#static-1-1",   "top":  14, "left": 14 },
		{ "id": "#static-1-1-1", "top":  22, "left": 22 },
		{ "id": "#static-2",     "top": 121, "left": 6 }
	];
	jQuery.each( tests, function() {
		assert.equal( $( this.id ).position().top,  this.top,  "jQuery('" + this.top  + "').position().top" );
		assert.equal( $( this.id ).position().left, this.left, "jQuery('" + this.left + "').position().left" );
	} );

	// set offset
	tests = [
		{ "id": "#static-2",     "top": 200, "left": 200 },
		{ "id": "#static-2",     "top": 100, "left": 100 },
		{ "id": "#static-2",     "top":  -2, "left":  -2 },
		{ "id": "#static-2",     "top": 121, "left":   6 },
		{ "id": "#static-1-1-1", "top":  50, "left":  50 },
		{ "id": "#static-1-1-1", "top":  10, "left":  10 },
		{ "id": "#static-1-1-1", "top":  -1, "left":  -1 },
		{ "id": "#static-1-1-1", "top":  22, "left":  22 },
		{ "id": "#static-1-1",   "top":  25, "left":  25 },
		{ "id": "#static-1-1",   "top":  10, "left":  10 },
		{ "id": "#static-1-1",   "top":  -3, "left":  -3 },
		{ "id": "#static-1-1",   "top":  14, "left":  14 },
		{ "id": "#static-1",     "top":  30, "left":  30 },
		{ "id": "#static-1",     "top":   2, "left":   2 },
		{ "id": "#static-1",     "top":  -2, "left":  -2 },
		{ "id": "#static-1",     "top":   7, "left":   7 }
	];
	jQuery.each( tests, function() {
		$( this.id ).offset( { "top": this.top, "left": this.left } );
		assert.equal( $( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		assert.equal( $( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

		$( this.id ).offset( { "top": this.top, "left": this.left, "using": function( props ) {
			$( this ).css( {
				"top":  props.top  + 1,
				"left": props.left + 1
			} );
		} } );
		assert.equal( $( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + ( this.top  + 1 ) + ", using: fn })" );
		assert.equal( $( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + ( this.left + 1 ) + ", using: fn })" );
	} );
} );

testIframe( "fixed", "offset/fixed.html", function( assert, $, window ) {
	assert.expect( 34 );

	var tests, $noTopLeft;

	tests = [
		{
			"id": "#fixed-1",
			"offsetTop": 1001,
			"offsetLeft": 1001,
			"positionTop": 0,
			"positionLeft": 0
		},
		{
			"id": "#fixed-2",
			"offsetTop": 1021,
			"offsetLeft": 1021,
			"positionTop": 20,
			"positionLeft": 20
		}
	];

	jQuery.each( tests, function() {
		if ( !window.supportsScroll ) {
			assert.ok( true, "Browser doesn't support scroll position." );
			assert.ok( true, "Browser doesn't support scroll position." );
			assert.ok( true, "Browser doesn't support scroll position." );
			assert.ok( true, "Browser doesn't support scroll position." );

		} else if ( window.supportsFixedPosition ) {
			assert.equal( $( this.id ).offset().top,  this.offsetTop,  "jQuery('" + this.id + "').offset().top" );
			assert.equal( $( this.id ).position().top,  this.positionTop,  "jQuery('" + this.id + "').position().top" );
			assert.equal( $( this.id ).offset().left, this.offsetLeft, "jQuery('" + this.id + "').offset().left" );
			assert.equal( $( this.id ).position().left,  this.positionLeft,  "jQuery('" + this.id + "').position().left" );
		} else {

			// need to have same number of assertions
			assert.ok( true, "Fixed position is not supported" );
			assert.ok( true, "Fixed position is not supported" );
			assert.ok( true, "Fixed position is not supported" );
			assert.ok( true, "Fixed position is not supported" );
		}
	} );

	tests = [
		{ "id": "#fixed-1", "top": 100, "left": 100 },
		{ "id": "#fixed-1", "top":   0, "left":   0 },
		{ "id": "#fixed-1", "top":  -4, "left":  -4 },
		{ "id": "#fixed-2", "top": 200, "left": 200 },
		{ "id": "#fixed-2", "top":   0, "left":   0 },
		{ "id": "#fixed-2", "top":  -5, "left":  -5 }
	];

	jQuery.each( tests, function() {
		if ( window.supportsFixedPosition ) {
			$( this.id ).offset( { "top": this.top, "left": this.left } );
			assert.equal( $( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
			assert.equal( $( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

			$( this.id ).offset( { "top": this.top, "left": this.left, "using": function( props ) {
				$( this ).css( {
					"top":  props.top  + 1,
					"left": props.left + 1
				} );
			} } );
			assert.equal( $( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + ( this.top  + 1 ) + ", using: fn })" );
			assert.equal( $( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + ( this.left + 1 ) + ", using: fn })" );
		} else {

			// need to have same number of assertions
			assert.ok( true, "Fixed position is not supported" );
			assert.ok( true, "Fixed position is not supported" );
			assert.ok( true, "Fixed position is not supported" );
			assert.ok( true, "Fixed position is not supported" );
		}
	} );

	// Bug 8316
	$noTopLeft = $( "#fixed-no-top-left" );
	if ( window.supportsFixedPosition ) {
		assert.equal( $noTopLeft.offset().top,  1007,  "Check offset top for fixed element with no top set" );
		assert.equal( $noTopLeft.offset().left, 1007, "Check offset left for fixed element with no left set" );
	} else {

		// need to have same number of assertions
		assert.ok( true, "Fixed position is not supported" );
		assert.ok( true, "Fixed position is not supported" );
	}
} );

testIframe( "table", "offset/table.html", function( assert, $ ) {
	assert.expect( 4 );

	assert.equal( $( "#table-1" ).offset().top, 6, "jQuery('#table-1').offset().top" );
	assert.equal( $( "#table-1" ).offset().left, 6, "jQuery('#table-1').offset().left" );

	assert.equal( $( "#th-1" ).offset().top, 10, "jQuery('#th-1').offset().top" );
	assert.equal( $( "#th-1" ).offset().left, 10, "jQuery('#th-1').offset().left" );
} );

testIframe( "scroll", "offset/scroll.html", function( assert, $, win ) {
	assert.expect( 26 );

	assert.equal( $( "#scroll-1" ).offset().top, 7, "jQuery('#scroll-1').offset().top" );
	assert.equal( $( "#scroll-1" ).offset().left, 7, "jQuery('#scroll-1').offset().left" );

	assert.equal( $( "#scroll-1-1" ).offset().top, 11, "jQuery('#scroll-1-1').offset().top" );
	assert.equal( $( "#scroll-1-1" ).offset().left, 11, "jQuery('#scroll-1-1').offset().left" );

	// These tests are solely for master/compat consistency
	// Retrieving offset on disconnected/hidden elements is not officially
	// valid input, but will return zeros for back-compat
	assert.equal( $( "#hidden" ).offset().top, 0, "Hidden elements do not subtract scroll" );
	assert.equal( $( "#hidden" ).offset().left, 0, "Hidden elements do not subtract scroll" );

	// scroll offset tests .scrollTop/Left
	assert.equal( $( "#scroll-1" ).scrollTop(), 5, "jQuery('#scroll-1').scrollTop()" );
	assert.equal( $( "#scroll-1" ).scrollLeft(), 5, "jQuery('#scroll-1').scrollLeft()" );

	assert.equal( $( "#scroll-1-1" ).scrollTop(), 0, "jQuery('#scroll-1-1').scrollTop()" );
	assert.equal( $( "#scroll-1-1" ).scrollLeft(), 0, "jQuery('#scroll-1-1').scrollLeft()" );

	// scroll method chaining
	assert.equal( $( "#scroll-1" ).scrollTop( undefined ).scrollTop(), 5, ".scrollTop(undefined) is chainable (#5571)" );
	assert.equal( $( "#scroll-1" ).scrollLeft( undefined ).scrollLeft(), 5, ".scrollLeft(undefined) is chainable (#5571)" );

	win.name = "test";

	if ( !window.supportsScroll ) {
		assert.ok( true, "Browser doesn't support scroll position." );
		assert.ok( true, "Browser doesn't support scroll position." );

		assert.ok( true, "Browser doesn't support scroll position." );
		assert.ok( true, "Browser doesn't support scroll position." );
	} else {
		assert.equal( $( win ).scrollTop(), 1000, "jQuery(window).scrollTop()" );
		assert.equal( $( win ).scrollLeft(), 1000, "jQuery(window).scrollLeft()" );

		assert.equal( $( win.document ).scrollTop(), 1000, "jQuery(document).scrollTop()" );
		assert.equal( $( win.document ).scrollLeft(), 1000, "jQuery(document).scrollLeft()" );
	}

	// test jQuery using parent window/document
	// jQuery reference here is in the iframe
	window.scrollTo( 0, 0 );
	assert.equal( $( window ).scrollTop(), 0, "jQuery(window).scrollTop() other window" );
	assert.equal( $( window ).scrollLeft(), 0, "jQuery(window).scrollLeft() other window" );
	assert.equal( $( document ).scrollTop(), 0, "jQuery(window).scrollTop() other document" );
	assert.equal( $( document ).scrollLeft(), 0, "jQuery(window).scrollLeft() other document" );

	// Tests scrollTop/Left with empty jquery objects
	assert.notEqual( $().scrollTop( 100 ), null, "jQuery().scrollTop(100) testing setter on empty jquery object" );
	assert.notEqual( $().scrollLeft( 100 ), null, "jQuery().scrollLeft(100) testing setter on empty jquery object" );
	assert.notEqual( $().scrollTop( null ), null, "jQuery().scrollTop(null) testing setter on empty jquery object" );
	assert.notEqual( $().scrollLeft( null ), null, "jQuery().scrollLeft(null) testing setter on empty jquery object" );
	assert.strictEqual( $().scrollTop(), undefined, "jQuery().scrollTop() testing getter on empty jquery object" );
	assert.strictEqual( $().scrollLeft(), undefined, "jQuery().scrollLeft() testing getter on empty jquery object" );
} );

testIframe( "body", "offset/body.html", function( assert, $ ) {
	assert.expect( 4 );

	assert.equal( $( "body" ).offset().top, 1, "jQuery('#body').offset().top" );
	assert.equal( $( "body" ).offset().left, 1, "jQuery('#body').offset().left" );
	assert.equal( $( "#firstElement" ).position().left, 5, "$('#firstElement').position().left" );
	assert.equal( $( "#firstElement" ).position().top, 5, "$('#firstElement').position().top" );
} );

QUnit.test( "chaining", function( assert ) {
	assert.expect( 3 );

	var coords = { "top":  1, "left":  1 };
	assert.equal( jQuery( "#absolute-1" ).offset( coords ).jquery, jQuery.fn.jquery, "offset(coords) returns jQuery object" );
	assert.equal( jQuery( "#non-existent" ).offset( coords ).jquery, jQuery.fn.jquery, "offset(coords) with empty jQuery set returns jQuery object" );
	assert.equal( jQuery( "#absolute-1" ).offset( undefined ).jquery, jQuery.fn.jquery, "offset(undefined) returns jQuery object (#5571)" );
} );

// Test complex content under a variety of <html>/<body> positioning styles
( function() {
	var POSITION_VALUES = [ "static", "relative", "absolute", "fixed" ],

		// Use shorthands for describing an element's relevant properties
		BOX_PROPS =
			( "left top  marginLeft marginTop  borderLeft borderTop  paddingLeft paddingTop" +
            "  style  parent" ).split( /\s+/g ),
		props = function() {
			var propObj = {};
			supportjQuery.each( arguments, function( i, value ) {
				propObj[ BOX_PROPS[ i ] ] = value;
			} );
			return propObj;
		},

		// Values must stay synchronized with test/data/offset/boxes.html
		divProps = function( position, parentId ) {
			return props( 4, 8,  8, 16,  2, 4,  16, 32,  position, parentId );
		},
		htmlProps = function( position ) {
			return props( position === "static" ? 0 : 2048, position === "static" ? 0 : 4096,
				32, 64,  64, 128,  128, 256,  position );
		},
		bodyProps = function( position ) {
			return props( position === "static" ? 0 : 4096, position === "static" ? 0 : 8192,
				256, 512,  512, 1024,  1024, 2048,  position,
				position !== "fixed" && "documentElement" );
		},
		viewportScroll = { left: 1, top: 2 };

	// Cover each combination of <html> position and <body> position
	supportjQuery.each( POSITION_VALUES, function( _, htmlPos ) {
		supportjQuery.each( POSITION_VALUES, function( _, bodyPos ) {
			var label = "nonzero box properties - html." + htmlPos + " body." + bodyPos,

				// Initialize data about page elements
				expectations = {
					"documentElement":   htmlProps( htmlPos ),
					"body":              bodyProps( bodyPos ),
					"relative":          divProps( "relative", "body" ),
					"relative-relative": divProps( "relative", "relative" ),
					"relative-absolute": divProps( "absolute", "relative" ),
					"absolute":          divProps( "absolute", "body" ),
					"absolute-relative": divProps( "relative", "absolute" ),
					"absolute-absolute": divProps( "absolute", "absolute" ),
					"fixed":             divProps( "fixed" ),
					"fixed-relative":    divProps( "relative", "fixed" ),
					"fixed-absolute":    divProps( "absolute", "fixed" )
				};

			// Define position and offset expectations for page elements
			supportjQuery.each( expectations, function( id, props ) {
				var parent = expectations[ props.parent ],

					// position() relates an element's margin box to its offset parent's padding box
					pos = props.pos = {
						top: props.top,
						left: props.left
					},

					// offset() relates an element's border box to the document origin
					offset = props.offset = {
						top: pos.top + props.marginTop,
						left: pos.left + props.marginLeft
					};

				// Account for ancestors differently by element position
				// fixed: ignore them
				// absolute: offset includes offsetParent offset+border
				// relative: position includes parent padding (and also position+margin+border when
				//   parent is not offsetParent); offset includes parent offset+border+padding
				// static: same as relative
				for ( ; parent; parent = expectations[ parent.parent ] ) {
					// position:fixed
					if ( props.style === "fixed" ) {
						break;
					}

					// position:absolute bypass
					if ( props.style === "absolute" && parent.style === "static" ) {
						continue;
					}

					// Offset update
					offset.top += parent.offset.top + parent.borderTop;
					offset.left += parent.offset.left + parent.borderLeft;
					if ( props.style !== "absolute" ) {
						offset.top += parent.paddingTop;
						offset.left += parent.paddingLeft;

						// position:relative or position:static position update
						pos.top += parent.paddingTop;
						pos.left += parent.paddingLeft;
						if ( parent.style === "static" ) {
							pos.top += parent.pos.top + parent.marginTop + parent.borderTop;
							pos.left += parent.pos.left + parent.marginLeft + parent.borderLeft;
						}
					}
					break;
				}

				// Viewport scroll affects position:fixed elements, except when a position:fixed
				// html element makes the page unscrollable
				if ( props.style === "fixed" && expectations.documentElement.style !== "fixed" ) {
					offset.top += viewportScroll.top;
					offset.left += viewportScroll.left;
				}
			} );

			// Test them
			testIframe( label, "offset/boxes.html", function( assert, $, iframe, doc ) {
				assert.expect( 33 );

				// Setup documentElement and body styles
				doc.documentElement.style.position = htmlPos;
				doc.body.style.position = bodyPos;

				// Verify expected document offset
				supportjQuery.each( expectations, function( id, descriptor ) {
					assert.deepEqual(
						supportjQuery.extend( {}, $( "#" + id ).offset() ),
						descriptor.offset,
						"jQuery('#" + id + "').offset()" );
				} );

				// Verify expected relative position
				supportjQuery.each( expectations, function( id, descriptor ) {
					assert.deepEqual(
						supportjQuery.extend( {}, $( "#" + id ).position() ),
						descriptor.pos,
						"jQuery('#" + id + "').position()" );
				} );

				// Verify that values round-trip
				supportjQuery.each( Object.keys( expectations ).reverse(), function( _, id ) {
					var $el = $( "#" + id ),
						pos = supportjQuery.extend( {}, $el.position() );

					$el.css( { top: pos.top, left: pos.left } );
					if ( $el.css( "position" ) === "relative" ) {

						// $relative.position() includes parent padding; switch to absolute
						// positioning so we don't double its effects.
						$el.css( { position: "absolute" } );
					}
					assert.deepEqual( supportjQuery.extend( {}, $el.position() ), pos,
						"jQuery('#" + id + "').position() round-trips" );

					// TODO Verify .offset(...)
					// assert.deepEqual( $el.offset( offset ).offset(), offset )
					// assert.deepEqual( $el.offset( adjustedOffset ).offset(), adjustedOffset )
					// assert.deepEqual( $new.offset( offset ).offset(), offset )
				} );
			} );
		} );
	} );
} )();

QUnit.test( "offsetParent", function( assert ) {
	assert.expect( 13 );

	var body, header, div, area;

	body = jQuery( "body" ).offsetParent();
	assert.equal( body.length, 1, "Only one offsetParent found." );
	assert.equal( body[ 0 ], document.documentElement, "The html element is the offsetParent of the body." );

	header = jQuery( "#qunit" ).offsetParent();
	assert.equal( header.length, 1, "Only one offsetParent found." );
	assert.equal( header[ 0 ], document.documentElement, "The html element is the offsetParent of #qunit." );

	div = jQuery( "#nothiddendivchild" ).offsetParent();
	assert.equal( div.length, 1, "Only one offsetParent found." );
	assert.equal( div[ 0 ], document.getElementById( "qunit-fixture" ), "The #qunit-fixture is the offsetParent of #nothiddendivchild." );

	jQuery( "#nothiddendiv" ).css( "position", "relative" );

	div = jQuery( "#nothiddendivchild" ).offsetParent();
	assert.equal( div.length, 1, "Only one offsetParent found." );
	assert.equal( div[ 0 ], jQuery( "#nothiddendiv" )[ 0 ], "The div is the offsetParent." );

	div = jQuery( "body, #nothiddendivchild" ).offsetParent();
	assert.equal( div.length, 2, "Two offsetParent found." );
	assert.equal( div[ 0 ], document.documentElement, "The html element is the offsetParent of the body." );
	assert.equal( div[ 1 ], jQuery( "#nothiddendiv" )[ 0 ], "The div is the offsetParent." );

	area = jQuery( "#imgmap area" ).offsetParent();
	assert.equal( area[ 0 ], document.documentElement, "The html element is the offsetParent of the body." );

	div = jQuery( "<div>" ).css( { "position": "absolute" } ).appendTo( "body" );
	assert.equal( div.offsetParent()[ 0 ], document.documentElement, "Absolutely positioned div returns html as offset parent, see #12139" );

	div.remove();
} );

QUnit.test( "fractions (see #7730 and #7885)", function( assert ) {
	assert.expect( 2 );

	jQuery( "body" ).append( "<div id='fractions'/>" );

	var result,
		expected = { "top": 1000, "left": 1000 },
		div = jQuery( "#fractions" );

	div.css( {
		"position": "absolute",
		"left": "1000.7432222px",
		"top": "1000.532325px",
		"width": 100,
		"height": 100
	} );

	div.offset( expected );

	result = div.offset();

	// Support: Chrome <=45 - 46
	// In recent Chrome these values differ a little.
	assert.ok( Math.abs( result.top - expected.top ) < 0.25, "Check top within 0.25 of expected" );
	assert.equal( result.left, expected.left, "Check left" );

	div.remove();
} );

QUnit.test( "iframe scrollTop/Left (see gh-1945)", function( assert ) {
	assert.expect( 2 );

	var ifDoc = jQuery( "#iframe" )[ 0 ].contentDocument;

	// Mobile Safari resize the iframe by its content meaning it's not possible to scroll
	// the iframe but only its parent element.
	// It seems (not confirmed) in android 4.0 it's not possible to scroll iframes from the code.
	if (
		/iphone os/i.test( navigator.userAgent ) ||
		/android 4\.0/i.test( navigator.userAgent )
	) {
		assert.equal( true, true, "Can't scroll iframes in this environment" );
		assert.equal( true, true, "Can't scroll iframes in this environment" );

	} else {

		// Tests scrollTop/Left with iframes
		jQuery( "#iframe" ).css( "width", "50px" ).css( "height", "50px" );
		ifDoc.write( "<div style='width: 1000px; height: 1000px;'></div>" );

		jQuery( ifDoc ).scrollTop( 200 );
		jQuery( ifDoc ).scrollLeft( 500 );

		assert.equal( jQuery( ifDoc ).scrollTop(), 200, "$($('#iframe')[0].contentDocument).scrollTop()" );
		assert.equal( jQuery( ifDoc ).scrollLeft(), 500, "$($('#iframe')[0].contentDocument).scrollLeft()" );
	}
} );

} )();
