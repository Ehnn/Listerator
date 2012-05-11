(function ($) {
    var methods = {
        createLine: function (options, data, lineNumber) {
            var layout = data.layout;
            var line;

            if (options.layout == 'simple')
                line = $('<div />');
            else
                line = layout.clone();

            data.element.find('[listerator-display="true"]').each(function (i, el) {
                //var fieldname = $(el).attr('name');
                el = $(el);
                //var realfield = $(data.element.find('[name=' + fieldname + ']'));
                if (options.layout == 'simple') {
                    var span = $('<span />').text(el.val()).css('margin', '10px');
                    span.attr('name', el.attr('name') + lineNumber);
                    span.appendTo(line);
                }
                else {
                    var span = $('<span />').text(el.val()).attr('name', el.attr('name') + lineNumber);
                    line.find('[name=' + el.attr('name') + ']').replaceWith(span);
                }
            });

            var removebutton = $('<button />').text("remove").button().click(methods['removeClick']);
            line.append(removebutton);

            line.data('listeratorLineNum', lineNumber);

            return line;
        },

        removeClick: function () {
            var element = $(this).parent().parent().data('element');
            var data = element.data('listeratorData');
            var options = element.data('listeratorOptions');

            var line = $(this).parent().data('listeratorLineNum');

            $(this).parent().remove();
            data.lines--;

            //Iterate the submit elements, correcting the names
        },

        addLine: function () {
            var data = $(this).parent().data('listeratorData');
            var options = $(this).parent().data('listeratorOptions');

            var newline;

            if (options.template)
                //to implement
                newline = methods.createLineFromTemplate(options, data);

            else if (options.create)
                //to implement
                newline = options.create(options, data);

            else
                newline = methods['createLine'](options, data, data.lines);

            data.submitcontainer.append(newline);
            data.lines++;


            if (options.lineCreated)
                options.lineCreated(line);

            return false;
        }
    };

    /** the element should be a non-div */
    $.fn.Listerator = function (options) {
        var defaults = {};
        var opts = $.extend(defaults, options);

        this.each(function () {
            var element = $(this);
            var container;
            var lineCounter = 0;

            var layout = element.clone();

            var wrapper = $('<div />').addClass('listerator-wrapper');
            element.before(wrapper);
            var elementdiv = $('<div />').append(element).appendTo(wrapper);
            var plusbutton = $('<button />').text("add").button().click(methods['addLine']).appendTo(element);
            var submitcontainer = $('<div />').appendTo(wrapper);

            var listeratorData = {
                submitcontainer: submitcontainer,
                layout: layout,
                element: element,
                lines: 0
            };

            element.data("listeratorData", listeratorData);
            element.data("listeratorOptions", opts);

            submitcontainer.data('element', element);
        });

        return this;
    };
})(jQuery);