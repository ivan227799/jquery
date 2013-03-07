module("support", { teardown: moduleTeardown });

test("boxModel", function() {
	expect( 1 );

	equal( jQuery.support.boxModel, document.compatMode === "CSS1Compat" , "jQuery.support.boxModel is sort of tied to quirks mode but unstable since 1.8" );
});

if ( jQuery.css ) {
	testIframeWithCallback( "body background is not lost if set prior to loading jQuery (#9239)", "support/bodyBackground.html", function( color, support ) {
		expect( 2 );
			var okValue = {
				"#000000": true,
				"rgb(0, 0, 0)": true
			};
		ok( okValue[ color ], "color was not reset (" + color + ")" );

		deepEqual( jQuery.extend( {}, support ), jQuery.support, "Same support properties" );
	});
}

testIframeWithCallback( "A background on the testElement does not cause IE8 to crash (#9823)", "support/testElementCrash.html", function() {
	expect( 1 );
	ok( true, "IE8 does not crash" );
});

testIframeWithCallback( "box-sizing does not affect jQuery.support.shrinkWrapBlocks", "support/shrinkWrapBlocks.html", function( shrinkWrapBlocks ) {
	expect( 1 );
	strictEqual( shrinkWrapBlocks, jQuery.support.shrinkWrapBlocks, "jQuery.support.shrinkWrapBlocks properties are the same" );
});

(function() {
	var expected,
		userAgent = window.navigator.userAgent;

	if ( /chrome/i.test( userAgent ) ) {
		expected = {
			"checkOn":true,
			"optSelected":true,
			"optDisabled":true,
			"focusinBubbles":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"radioValue":true,
			"checkClone":true,
			"boxModel":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true,
			"clearCloneStyle": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"pixelPosition": false
		};
	} else if ( /opera.*version\/12\.1/i.test( userAgent ) ) {
		expected = {
			"checkOn":true,
			"optSelected":true,
			"optDisabled":true,
			"focusinBubbles":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"radioValue":false,
			"checkClone":true,
			"boxModel":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true,
			"clearCloneStyle": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"pixelPosition": true
		};
	} else if ( /msie 10\.0/i.test( userAgent ) ) {
		expected = {
			"checkOn":true,
			"optSelected":false,
			"optDisabled":true,
			"focusinBubbles":true,
			"reliableMarginRight":true,
			"noCloneChecked":false,
			"radioValue":false,
			"checkClone":true,
			"boxModel":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true,
			"clearCloneStyle": false,
			"boxSizing": true,
			"boxSizingReliable": false,
			"pixelPosition": true
		};
	} else if ( /msie 9\.0/i.test( userAgent ) ) {
		expected = {
			"checkOn":true,
			"optSelected":false,
			"optDisabled":true,
			"focusinBubbles":true,
			"reliableMarginRight":true,
			"noCloneChecked":false,
			"radioValue":false,
			"checkClone":true,
			"boxModel":true,
			"ajax":true,
			"cors":false,
			"doesNotIncludeMarginInBodyOffset":true,
			"clearCloneStyle": false,
			"boxSizing": true,
			"boxSizingReliable": false,
			"pixelPosition": true
		};
	} else if ( /5\.1\.\d+ safari/i.test( userAgent ) ) {
		expected = {
			"checkOn":false,
			"optSelected":true,
			"optDisabled":true,
			"focusinBubbles":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"radioValue":true,
			"checkClone":false,
			"boxModel":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true,
			"clearCloneStyle": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"pixelPosition": false
		};
	} else if ( /firefox/i.test( userAgent ) ) {
		expected = {
			"checkOn":true,
			"optSelected":true,
			"optDisabled":true,
			"focusinBubbles":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"radioValue":true,
			"checkClone":true,
			"boxModel":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true,
			"clearCloneStyle": true,
			"boxSizing": true,
			"boxSizingReliable": false,
			"pixelPosition": true
		};
	}

	if ( expected ) {
		test("Verify that the support tests resolve as expected per browser", function() {
			var i, prop,
				j = 0;

			for ( prop in jQuery.support ) {
				j++;
			}

			expect( j );

			for ( i in expected ) {
				if ( jQuery.ajax || i !== "ajax" && i !== "cors" ) {
					equal( jQuery.support[i], expected[i], "jQuery.support['" + i + "']: " + jQuery.support[i] + ", expected['" + i + "']: " + expected[i]);
				} else {
					ok( true, "no ajax; skipping jQuery.support['" + i + "']" );
				}
			}
		});
	}

})();

// Support: Safari 5.1
// Shameless browser-sniff, but Safari 5.1 mishandles CSP
if ( !( typeof navigator !== "undefined" &&
	(/ AppleWebKit\/\d.*? Version\/(\d+)/.exec(navigator.userAgent) || [])[1] < 6 ) ) {

	testIframeWithCallback( "Check CSP (https://developer.mozilla.org/en-US/docs/Security/CSP) restrictions", "support/csp.php", function( support ) {
		expect( 1 );
		deepEqual( jQuery.extend( {}, support ), jQuery.support, "No violations of CSP polices" );
	});
}
