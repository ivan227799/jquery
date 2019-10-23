import jQuery from "../core";
import documentElement from "../var/documentElement";

import "../selector/contains"; // jQuery.contains

var isAttached = function( elem ) {
		return jQuery.contains( elem.ownerDocument, elem );
	},
	composed = { composed: true };

// Support: IE 9 - 11+, Edge 12 - 18+
// Check attachment across shadow DOM boundaries when possible (gh-3504)
if ( documentElement.getRootNode ) {
	isAttached = function( elem ) {
		return jQuery.contains( elem.ownerDocument, elem ) ||
			elem.getRootNode( composed ) === elem.ownerDocument;
	};
}

export default isAttached;
