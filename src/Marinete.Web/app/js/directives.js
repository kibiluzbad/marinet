'use strict';

/* Directives */


var directives = angular.module('marinet.directives', []);

directives.directive('butterbar', ['$rootScope',
function ($rootScope) {
    return {
        link: function (scope, element, attrs) {
            element.addClass('hide');
            $rootScope.$on('$routeChangeStart', function () {
                element.removeClass('hide');
            });
            $rootScope.$on('$routeChangeSuccess', function () {
                element.addClass('hide');
            });
        }
    };
} ]);

directives.directive('focus',
function () {
    return {
        link: function (scope, element, attrs) {
            element[0].focus();
        }
    };
});

directives.directive('onEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.onEnter);
                });

                event.preventDefault();
            }
        });
    };
});

directives.directive('buttonCheck',
function () {
    return {
        link: function (scope, element, attrs) {
            return $(element).iButton();
        }
    };
});