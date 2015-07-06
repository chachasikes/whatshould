'use strict';
test('my first qunit test', function() {
    ok(2 + 2 === 4, 'Passed!');
});

(function($) {
    module('SaveSickChild: login component test', {   
        setup: function() {   
            // test setup code goes here
        },
        teardown: function() {   
            // test cleanup code goes here
        }
    });
    test('jquery is here', function() {   
        ok($, "yes, it's here");
    });
    test("2 add 2 equals 4", function() {
        ok(2 + 2 === 4, "Passed!");   
    });
    test('2 add 2 not equals 5', function() {
        notEqual(2 + 2, 5, "failed");   
    });
}(jQuery));