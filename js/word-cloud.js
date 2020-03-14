(function($) {
    $.fn.arrangeTextsInEllipse = function(options) {

        var defaults = {
            color: ['#6465a3', '#a02c4e', '#791c17', '#2833bc', '#575798',
                '#c3332c', '#562c99', '#9e9d9f', '#8d2a62', '#606098'
            ],
            fontSize: ['1.0', '1.2', '1.4', '1.6', '1.8',
                '3.0', '3.2', '3.4', '3.6', '3.8',
                '4.0', '4.2', '4.4', '4.6', '4.8',
                '5.0', '5.2', '5.4', '5.6', '5.8',
                '6.0', '6.2', '6.4', '6.6', '6.8',
                '7.0'
            ]
        };

        var options = $.extend({}, defaults, options);

        var ulId = '#' + $(this).attr('id');
        var length = $(ulId).find('li').length;
        var condition = new Array(length);
        for (var i = 0; i < length; i++) {
            condition[i] = 'true';
        }

        $(ulId + ' > li').each(function(index) {
            condition[index] = insideEllipse(ulId, $(this), options.color, options.fontSize, index, length, condition);
        });

        function insideEllipse(ulId, obj, color, fontSize, index, length, condition) {

            var $this = obj;
            var string = $this.text();
            var ulWidth = $(ulId).width();
            var ulHeight = $(ulId).height();
            var a = ulWidth / 2;
            var b = ulHeight / 2;
            for (var i = 0; i < 5000; i++) {

                // weight factor; decrease the font size as the trial increases
                var weight = 1;
                if (i > 7000) {
                    weight = 0.7;
                } else if (i > 6000) {
                    weight = 0.8;
                } else if (i > 5000) {
                    weight = 0.9;
                }

                var colorIndex = Math.floor(Math.random() * color.length);
                var fontSizeIndex = Math.floor(Math.random() * fontSize.length * weight);
                thisColor = color[colorIndex];
                thisFontSize = fontSize[fontSizeIndex];
                stringLength = string.length * thisFontSize * 10;
                stringHeight = thisFontSize * 10;

                var xPos = new Array(4);
                var yPos = new Array(4);
                var ellipticEq = new Array(4);
                var x = Math.floor(Math.random() * ulWidth) - a;
                var y = Math.floor(Math.random() * ulHeight) - b;

                // (x,y) of [1]: top-left, [2]: top-right, [3]: bottom-left, [4]: bottom-right
                xPos[0] = x;
                yPos[0] = y;
                xPos[1] = x + stringLength;
                yPos[1] = y;
                xPos[2] = x;
                yPos[2] = y + stringHeight;
                xPos[3] = x + stringLength;
                yPos[3] = y + stringHeight;

                ellipticEq[0] = Math.pow(xPos[0], 2) / Math.pow(a, 2) + Math.pow(yPos[0], 2) / Math.pow(b, 2);
                ellipticEq[1] = Math.pow(xPos[1], 2) / Math.pow(a, 2) + Math.pow(yPos[1], 2) / Math.pow(b, 2);
                ellipticEq[2] = Math.pow(xPos[2], 2) / Math.pow(a, 2) + Math.pow(yPos[2], 2) / Math.pow(b, 2);
                ellipticEq[3] = Math.pow(xPos[3], 2) / Math.pow(a, 2) + Math.pow(yPos[3], 2) / Math.pow(b, 2);

                // if (x,y) lies inside of the ellipse
                if ((ellipticEq[0] <= 1) && (ellipticEq[1] <= 1) && (ellipticEq[2] <= 1) && (ellipticEq[3] <= 1)) {

                    // check if the strings do not overlap with each other
                    var allCondition = true;
                    for (var j = 0; j < length; j++) {
                        // set allCondition false if (x,y) lies inside of the ellipse
                        if (!(eval(condition[j]))) {
                            allCondition = false;
                            break;
                        }
                    }

                    // position the string
                    if (allCondition) {
                        $this.css({
                            'position': 'absolute',
                            'left': xPos[0] + a,
                            'top': yPos[0] + b,
                            'color': thisColor,
                            'font-size': thisFontSize + 'rem'
                        });

                        // returns a new condition to avoid the overlap of two text areas
                        var newCondition =
                            '(' + xPos[3] + ' < xPos[0] || ' + xPos[0] + ' > xPos[3]  || ' + yPos[0] + ' > yPos[3] || ' + yPos[3] + ' < yPos[0] )';
                        // console.log(i+' trials');
                        return newCondition;
                    }
                }
            }
            // console.log(string + ' is not located');
            newCondition = 'true';
            $this.css('display', 'none');
        }
    };
})(jQuery);
$(document).ready(function() {
    var defaults = {};
    $('#word-cloud').arrangeTextsInEllipse(defaults);
});