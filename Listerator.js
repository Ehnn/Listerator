(function ($) {
    var methods = {
        createLine: function (options, data, lineNumber) {
            var line = options.template.clone();
            line.find('[listerator-name]').each(function (i, el) {
                $el = $(el);
                var name = $el.attr("listerator-name");

                //change our name
                $el.attr('name', name + lineNumber);

                //retrieve the value
                data.element.find('[name=' + name + ']').each(function (i, el2) {
                    $el.text($(el2).val());
                });
            });

            var removebutton = $('<button />').text("remove").button().click(methods['removeClick']).appendTo(line);
            line.data('listeratorLineNum', lineNumber);

            return line;
        },

        createTemplateFromElement: function (element, options) {
            var template;
            switch (options.layout) {
                case 'copy':
                    template = element.clone();
                    break;
                case 'simple':
                default:
                    template = $('<div />');
                    break;
            }

            element.find('[listerator-display="true"]').each(function (i, el) {
                $el = $(el);
                
                switch (options.layout) {
                    //use the original layout, replace listerator-display with a span of its value
                    case 'copy':
                        var span = $('<span />').attr('listerator-name', $el.attr('name'));
                        line.find('[name=' + $el.attr('name') + ']').replaceWith(span);
                        break;
                    //put the display data into spans
                    case 'simple':
                    default:
                        var span = $('<span />').css('margin', '10px');
                        span.attr('listerator-name', $el.attr('name'));
                        span.appendTo(template);
                        break;
                }
            });

            return template;
        },

        removeClick: function () {
            var element = $(this).parent().parent().data('element');
            var data = element.data('listeratorData');
            var options = element.data('listeratorOptions');

            var line = $(this).parent().data('listeratorLineNum');

            $(this).parent().remove();
            data.lines--;

            //Iterate the submit elements, correcting the names
            data.submitcontainer.children().each(function (i, submitline) {
                $(submitline).find('[listerator-name]').each(function (j, el) {
                    $el = $(el);
                    $el.attr('name', $el.attr('listerator-name') + i);
                });
            });
        },

        addLine: function () {
            var data = $(this).parent().data('listeratorData');
            var options = $(this).parent().data('listeratorOptions');

            var newline;

            newline = methods['createLine'](options, data, data.lines);

            data.submitcontainer.append(newline);
            data.lines++;

            //erase data
            if (options.eraseData)
                data.element.find('[listerator-display="true"]').each(function (i, el) { $(el).val(''); });


            if (options.lineCreated)
                options.lineCreated(line);

            return false;
        }
    };

    $.fn.Listerator = function (options) {
        var defaults = {
            eraseData: true
        };
        var options = $.extend(defaults, options);

        this.each(function () {
            var element = $(this);
            var container;

            var layout = element.clone();

            var wrapper = $('<div />').addClass('listerator-wrapper');
            element.before(wrapper);
            var elementdiv = $('<div />').append(element).appendTo(wrapper);
            var plusbutton = $('<button />').text("add").button().click(methods['addLine']).appendTo(element);
            var submitcontainer = $('<div />').attr('id', 'submitcontainer').appendTo(wrapper);

            if (options.template) {
                options.template = $(options.template).clone();
                if (options.template.css('display', 'none'))
                    options.template.css('display', 'block');
            }

            else if (!options.template)
                options.template = methods['createTemplateFromElement'](element, options);

            var listeratorData = {
                submitcontainer: submitcontainer,
                layout: layout,
                element: element,
                lines: 0
            };

            element.data("listeratorData", listeratorData);
            element.data("listeratorOptions", options);

            submitcontainer.data('element', element);
        });

        return this;
    };
})(jQuery);