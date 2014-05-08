'use strict';
/*
	``btn-loading`` attribute.
 
	This attribute will update the button state using Twitter Bootstrap button plugin and
	according the attribute value.
 
	The attribute value should be a scope variable.
	If the variable is ``true`` the button will have the ``loading`` state.
	If the variable is ``false`` the button will be reset and displayed normaly.
 
        Usage:
            <button class="btn" btn-loading="is_loading" data-loading-text="Save in progess ..">Save</button>
 
*/
angular.module('marinetApp')
  .directive("btnLoading", function(){
	return{ 
        link: function(scope, element, attrs){
            element.bind("click", function (event) {
                element.button("loading");
            });
	    },
        restrict: 'A'
    };
});
