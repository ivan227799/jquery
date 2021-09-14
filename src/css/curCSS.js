import jQuery from "../core.js";
import isAttached from "../core/isAttached.js";
import getStyles from "./var/getStyles.js";
import rcustomProp from "./var/rcustomProp.js";

function curCSS( elem, name, computed ) {
	var ret,
		isCustomProp = rcustomProp.test( name );

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for `.css('--customProperty')` (gh-3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		// trim whitespace for custom property (issue #4926)
		if ( isCustomProp ) {
			ret = ret.trim();
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}

export default curCSS;
