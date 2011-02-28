module("dimensions", { teardown: moduleTeardown });

function pass( val ) {
	return val;
}

function fn( val ) {
	return function(){ return val; };
}

function testWidth( val ) {
	expect(10);

	var $div = jQuery("#nothiddendiv");
	$div.width( val(30) );
	equals($div.width(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.width(), 30, "Test hidden div");
	$div.show();
	$div.width( val(-1) ); // handle negative numbers by ignoring #1599
	equals($div.width(), 30, "Test negative width ignored");
	$div.css("padding", "20px");
	equals($div.width(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.width(), 30, "Test border specified with pixels");
	
	$div.width($div.width());
	equals($div.width(), 30, "Test getting and setting width");
	
	$div.css({ display: "", border: "", padding: "" });

	jQuery("#nothiddendivchild").css({ width: 20, padding: "3px", border: "2px solid #fff" });
	equals(jQuery("#nothiddendivchild").width(), 20, "Test child width with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", width: "" });

	var blah = jQuery("blah");
	equals( blah.width( val(10) ), blah, "Make sure that setting a width on an empty set returns the set." );
	equals( blah.width(), null, "Make sure 'null' is returned on an empty set");
	
	var button = jQuery("<button id='btn'></button>").appendTo("#main");
	button.width( val(20) );
	button.width( button.width() );
	equals(button.width(), 20, "Test getting and setting width");
	jQuery('#btn').remove();
	
	jQuery.removeData($div[0], 'olddisplay', true);
}

test("width()", function() {
	testWidth( pass );
});

test("width() with function", function() {
	testWidth( fn );
});

test("width() with function args", function() {
	expect( 2 );

	var $div = jQuery("#nothiddendiv");
	$div.width( 30 ).width(function(i, width) {
		equals( width, 30, "Make sure previous value is corrrect." );
		return width + 1;
	});

	equals( $div.width(), 31, "Make sure value was modified correctly." );
});

function testHeight( val ) {
	expect(10);

	var $div = jQuery("#nothiddendiv");
	$div.height( val(30) );
	equals($div.height(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.height(), 30, "Test hidden div");
	$div.show();
	$div.height( val(-1) ); // handle negative numbers by ignoring #1599
	equals($div.height(), 30, "Test negative height ignored");
	$div.css("padding", "20px");
	equals($div.height(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.height(), 30, "Test border specified with pixels");
	
	$div.height($div.height());
	equals($div.height(), 30, "Test getting and setting height");
	
	$div.css({ display: "", border: "", padding: "", height: "1px" });

	jQuery("#nothiddendivchild").css({ height: 20, padding: "3px", border: "2px solid #fff" });
	equals(jQuery("#nothiddendivchild").height(), 20, "Test child height with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", height: "" });

	var blah = jQuery("blah");
	equals( blah.height( val(10) ), blah, "Make sure that setting a height on an empty set returns the set." );
	equals( blah.height(), null, "Make sure 'null' is returned on an empty set");
	
	var button = jQuery("<button id='btn'></button>").appendTo("#main");
	button.height( val(20) );
	button.height( button.height() );
	equals(button.height(), 20, "Test getting and setting height");
	jQuery('#btn').remove();
	
	jQuery.removeData($div[0], 'olddisplay', true);
}

test("height()", function() {
	testHeight( pass );
});

test("height() with function", function() {
	testHeight( fn );
});

test("height() with function args", function() {
	expect( 2 );

	var $div = jQuery("#nothiddendiv");
	$div.height( 30 ).height(function(i, height) {
		equals( height, 30, "Make sure previous value is corrrect." );
		return height + 1;
	});

	equals( $div.height(), 31, "Make sure value was modified correctly." );
});

test("innerWidth()", function() {
	expect(4);

	var $div = jQuery("#nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		width: 30
	});

	equals($div.innerWidth(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equals($div.innerWidth(), 70, "Test with margin, border and padding");
	$div.hide();
	equals($div.innerWidth(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.innerWidth(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], 'olddisplay', true);
});

test("innerHeight()", function() {
	expect(4);

	var $div = jQuery("#nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		height: 30
	});

	equals($div.innerHeight(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equals($div.innerHeight(), 70, "Test with margin, border and padding");
	$div.hide();
	equals($div.innerHeight(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.innerHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], 'olddisplay', true);
});

test("outerWidth()", function() {
	expect(7);

	var $div = jQuery("#nothiddendiv");
	$div.css("width", 30);

	equals($div.outerWidth(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equals($div.outerWidth(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equals($div.outerWidth(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equals($div.outerWidth(), 74, "Test with padding, border and margin without margin option");
	$div.css("position", "absolute");
	equals($div.outerWidth(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equals($div.outerWidth(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ position: "", display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.outerWidth(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], 'olddisplay', true);
});

test("outerHeight()", function() {
	expect(7);

	var $div = jQuery("#nothiddendiv");
	$div.css("height", 30);

	equals($div.outerHeight(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equals($div.outerHeight(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equals($div.outerHeight(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equals($div.outerHeight(), 74, "Test with padding, border and margin without margin option");
	equals($div.outerHeight(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equals($div.outerHeight(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.outerHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], 'olddisplay', true);
});


test('width(), outerWidth(), innerWidth(), height(), outerHeight() and innerHeight() with inputs', function(){
	expect(95);
	
	var id = 'input-width-test-group';
	var input_els = 'submit reset button text image password radio checkbox file'.split(' ');
	var html = '<div id="' + id + '" style="width:100px;">';
	var style = 'width:35px;height:50px;padding:5px;border:1px solid #000;margin:2px;';
	
	html += '<div id="nothing-set-div">test</div>';
	html += '<div id="width-div-1" style="' + style + '">something</div>';
	html += '<button id="width-button-1" style="' + style + '">button</button>';
	jQuery.each(input_els, function() {
		html += '<input class="width-input" type="' + this + '" style="' + style + '" />';
	});
	html += '</div>';
	
	jQuery('#main').append(html);
	
	equals(jQuery('#nothing-set-div').width(), 100, 'Width of unset div takes on parent');
	
	jQuery('#width-div-1, #width-button-1, .width-input').each(function(){
		
		// Test widths
		var w = jQuery(this).width();
		var outer_w = jQuery(this).outerWidth();
		var outer_w_margin = jQuery(this).outerWidth(true);
		var inner_w = jQuery(this).innerWidth();
		var t = this.tagName.toLowerCase() + ((this.type) ? '[' + this.type + ']' : '');
		
		equals(w, 35, 'Make sure width() works for ' + t);
		equals(outer_w, 47, 'Make sure outerWidth() works for ' + t);
		equals(outer_w_margin, 51, 'Make sure outerWidth(true) works for ' + t);
		equals(inner_w, 45, 'Make sure innerWidth() works for ' + t);
		
		// Test heights
		var h = jQuery(this).height();
		var outer_h = jQuery(this).outerHeight();
		var outer_h_margin = jQuery(this).outerHeight(true);
		var inner_h = jQuery(this).innerHeight();
		
		equals(h, 50, 'Make sure height() works for ' + t);
		equals(outer_h, 62, 'Make sure outerHeight() works for ' + t);
		equals(outer_h_margin, 66, 'Make sure outerHeight(true) works for ' + t);
		equals(inner_h, 60, 'Make sure innerHeight() works for ' + t);
		
	});
	
	var inputsub = jQuery('.width-input').filter('input[type=submit]');
	inputsub.css({
		width: 10,
		padding: 0,
		margin: '3px',
		border: 1
	});
	
	var outer_w = inputsub.outerWidth();
	equals(outer_w, 12, 'outerWidth() works after setting css using .css()');
	
	var outer_w_margin = inputsub.outerWidth(true);
	equals(outer_w_margin, 18, 'outerWidth(true) works after setting css using .css()');
	
	inputsub.css('padding', 25);
	
	var inner_w = inputsub.innerWidth();
	equals(inner_w, 60, 'innerWidth() works after setting css using .css()');
	
	inputsub.css('height', '25px');
	
	var outer_h = inputsub.outerHeight();
	equals(outer_h, 77, 'outerHeight() works after setting css using .css()');
	
	var outer_h_margin = inputsub.outerHeight(true);
	equals(outer_h_margin, 83, 'outerHeight(true) works after setting css using .css()');
	
	var inner_h = inputsub.innerHeight();
	equals(inner_h, 75, 'innerHeight() works after setting css using .css()');
	
	jQuery('#' + id).remove();
	
});
