define([
	"./core",
	"./var/slice",
	"./callbacks"
], function( jQuery, slice ) {

function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, callbacks, .then handlers, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"),
					jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"),
					jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory"),
					jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							});
						});
						fns = null;
					}).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( deferred, handler, depth ) {
						return function() {
							var that = this === promise ? undefined : this,
								args = arguments,
								fn = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									try {
										returned = handler.apply( that, args );

										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError();
										}

										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&

											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;

										if ( jQuery.isFunction( then ) ) {
											maxDepth++;
											then.call(
												returned,
												resolve( deferred, Identity, maxDepth ),
												resolve( deferred, Thrower, maxDepth ),
												deferred.notify
											);
										} else if ( Identity === handler ) {
											deferred.resolveWith( that || deferred.promise(),
												args );
										} else {
											deferred.resolve( returned );
										}
									} catch ( e ) {

										// Support: Promises/A+ section 2.3.3.3.4.1
										// https://promisesaplus.com/#point-61
										// Ignore post-resolution exceptions
										if ( depth + 1 >= maxDepth ) {
											if ( Thrower === handler ) {
												deferred.rejectWith( that || deferred.promise(),
													args );
											} else {
												deferred.reject( e );
											}
										}
									}
								};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								fn();
							} else {
								setTimeout( fn );
							}
						};
					}

					return jQuery.Deferred(function( newDefer ) {
						// fulfilled_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity,
								0
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower,
								0
							)
						);

						// progress_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(function() {
							var that = this,
								args = arguments;
							setTimeout(function() {
								if ( jQuery.isFunction( onProgress ) ) {
									args = [ onProgress.apply( that, args ) ];
									that = newDefer.promise();
								}
								newDefer.notifyWith( that, args );
							});
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 4 ];

			// promise.done = list.add
			// promise.fail = list.add
			// promise.progress = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {
						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ i ^ 1 ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 2 ][ 2 ].lock
				);
			}

			// fulfilled_handlers.fire
			// rejected_handlers.fire
			// progress_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			// deferred.notify = function() { deferred.notifyWith(...) }
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};

			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			// deferred.notifyWith = list.fireWith
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});

return jQuery;
});
