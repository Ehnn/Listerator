(function ($) {
    var methods = {
        createLine: function (options, data) {

            

            var layout = data.layout;
            var line;

            if (options.layout == 'simple')
                line = $('<div />');
            else
                line = layout.clone();

            data.element.find('[listerator-display="true"]').each(function (i, el) {
                //var fieldname = $(el).attr('name');
                el = $(el);
                var val = el.val();
                console.log(val);
                //var realfield = $(data.element.find('[name=' + fieldname + ']'));
                if (options.layout == 'simple')
                    $('<span />').text(val).css('margin', '10px').appendTo(line);
                else {
                    var span = $('<span />').html(val);
                    line.find('[name=' + el.attr('name') + ']').replaceWith(span);
                }
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
                //to implement
                newline = methods.createLineFromTemplate(options, data);

            else if (options.create)
                //to implement
                newline = options.create(options, data);

            else
                newline = methods['createLine'](options, data);

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

            var layout = element.clone();

            var wrapper = $('<div />').addClass('listerator-wrapper');
            element.before(wrapper);
            var elementdiv = $('<div />').append(element).appendTo(wrapper);
            var plusbutton = $('<button />').text("add").button().click(methods['addLine']).appendTo(element);
            var submitcontainer = $('<div />').appendTo(wrapper);

            

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