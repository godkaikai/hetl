/*global requirejs */

// Ensure any request for this webjar brings in jQuery.
requirejs.config({
    shim: {
        "bootstrap3-editable": [ 'webjars!bootstrap.js' ]
    }
});
