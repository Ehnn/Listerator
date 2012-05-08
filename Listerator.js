(function ($) {
    var methods = {
        createLine: function (options, data) {

            var line = $('<div />');

            var layout = data.layout;
            $(layout).find('[listerator-display="true"]').each(function (i, el) {

                var fieldname = $(el).attr('name');
                var realfield = $(data.element.find('[name=' + fieldname + ']'));
                $('<span />').text(realfield.val()).css('margin', '10px').appendTo(line);
            });

            return line;

            /*var newline = lineLayout.attr('id', 'line' + lineCounter).clone();
            newline.find('[name]').each(function () { this.name += lineCounter });
            newline.find('[id]').each(function () { this.id += lineCounter });
            newline.find('[for]').each(function () { $(this).attr('for', $(this).attr('for') + lineCounter); });

            return newline;*/
        },

        addLine: function () {
            var data = $(this).parent().data('listeratorData');
            var options = $(this).parent().data('listeratorOptions');

            var newline;

            if (options.template)
                newline = methods.createLineFromTemplate();

            else if (options.create)
                newline = opts.create();

            else {
                newline = methods['createLine'](options, data);
                //var line = methods['createLine'](data.lineLayout, data.lineCounter++);
            }

            data.submitcontainer.append(newline);
            if (options.lineCreated)
                options.lineCreated(line);

            return false;
        },

        removeLine: function () {
            var data = $(this).parent().data('listeratorData');

            if (data.lineCounter > 0) {
                data.container.find('#line' + --data.lineCounter).remove();
            }
            return false;
        }
    };

    $.fn.Listerator = function (options) {
        var defaults = {};
        var opts = $.extend(defaults, options);

        this.each(function () {
            var element = $(this);
            var container;
            var lineCounter = 0;

            var wrapper = $('<div />').addClass('listerator-wrapper').appendTo(element.parent());
            var elementdiv = $('<div />').append(element).appendTo(wrapper);
            var plusbutton = $('<button />').text("add").button().click(methods['addLine']).appendTo(element);
            var submitcontainer = $('<div />').appendTo(wrapper);

            var layout = element.clone();

            var listeratorData = {
                submitcontainer: submitcontainer,
                layout: layout,
                element: element
                //lineCounter: lineCounter,
            };

            element.data("listeratorData", listeratorData);
            element.data("listeratorOptions", opts);


            //check if a template is given
            /*var lineLayout = element.children(':first').clone();

            container = $('<div />').appendTo(element);

            //Add the first line
            var line = methods['createLine'](lineLayout, lineCounter++);
            container.append(line);
            if (opts.lineCreated)
            opts.lineCreated(line);

            var listeratorData = {
            container: container,
            lineCounter: lineCounter,
            lineLayout: lineLayout
            };

            element.data("listeratorData", listeratorData);
            element.data("listeratorOptions", opts);

            var add = $("<button />").html("+").button().click(methods['addLine']).appendTo(element);
            var remove = $("<button />").html("-").button().click(methods['removeLine']).appendTo(element);*/
        });

        return this;
    };
})(jQuery);