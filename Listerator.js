(function ($) {
    //to do:
    //change lineCreate and dataCreate to jquery events
    //uniform class and id listerator- names
    var methods = {
        createLine: function (submitdata) {
            var line = $('<span />');
            var displayelement, submitelement;

            displayelement = methods.createDisplay(this.options.template, submitdata).addClass('listerator-display').appendTo(line);
            submitelement = methods.createSubmit(submitdata, this.lines).addClass('listerator-submit').appendTo(line);

            var removebutton = $('<button />').text("remove").addClass('listerator-button listerator-button-remove').button().click(methods['removeClick']).appendTo(displayelement);

            line.data("listeratorSubmitData", submitdata);
            line.data('listeratorLineNum', this.lines);

            return line;
        },

        createSubmit: function (submitdata, lineNumber) {
            var submitelement = $('<span />').css('display', 'none');

            for (var i in submitdata) {
                $('<input />').attr('type', 'hidden').attr('name', i + lineNumber).val(submitdata[i]).appendTo(submitelement);
            }

            return submitelement;
        },

        createDisplay: function (template, submitdata) {
            var displayelement = template.clone();

            if (displayelement.attr('id')) displayelement.attr('id', null);
            displayelement.find('[id]').each(function () { $(this).attr('id', null); });

            if (displayelement.attr('name')) displayelement.attr('name', null);
            displayelement.find('[name]').each(function () { $(this).attr('name', null); });


            displayelement.find('[data-listerator-name]').each(function (i, el) {
                $el = $(el);
                var name = $el.attr("data-listerator-name");
                $el.text(submitdata[name]);
            });

            return displayelement;
        },

        bind: function (data) {
            var options = this.options;
            var lines = this.lines;

            for (var i in data) {
                var newline = methods.createLine.call(this, data[i]);
                this.submitcontainer.append(newline);
                this.lines++;
            }
        },

        remove: function (lineNum) {
            this.submitcontainer.children(':nth-child(' + lineNum + ')').remove();
        },

        getSubmitData: function (lineNum) {
            return this.submitcontainer.children(':nth-child(' + lineNum + ')').data('listeratorSubmitData');
        },

        getLine: function (lineNum) {
            return this.submitcontainer.children(':nth-child(' + lineNum + ')');
        },

        //decide if we even want this
        createTemplateFromElement: function (element, options) {
            var template;
            switch (options.templatelayout) {
                case 'copy':
                    template = element.clone();
                    break;
                case 'simple':
                default:
                    template = $('<div />');
                    break;
            }

            element.find('[data-listerator-display="true"]').each(function (i, el) {
                $el = $(el);

                switch (options.templatelayout) {
                    //use the original layout, replace listerator-display with a span of its value                                                     
                    case 'copy':
                        var span = $('<span />').attr('data-listerator-name', $el.attr('name'));
                        line.find('[name=' + $el.attr('name') + ']').replaceWith(span);
                        break;
                    //put the display data into spans                                                     
                    case 'simple':
                    default:
                        var span = $('<span />').css('margin', '10px');
                        span.attr('data-listerator-name', $el.attr('name'));
                        span.appendTo(template);
                        break;
                }
            });

            return template;
        },

        removeClick: function () {
            var element = $(this).parent().parent().parent().data('element');
            var listerator = element.data('listerator');

            var line = $(this).parent().data('listeratorLineNum');

            $(this).parent().remove();
            listerator.lines--;

            //iterate the submit elements, correcting the names
            listerator.submitcontainer.children().each(function (i, submitline) {
                $(submitline).find('[listerator-name]').each(function (j, el) {
                    $el = $(el);
                    $el.attr('name', $el.attr('listerator-name') + i);
                });
            });
        },

        addClick: function () {
            var listerator = $(this).parent().data('listerator');
            var submitdata = {};

            listerator.element.find('input').each(function (i, el) {
                el = $(el);
                var val = el.attr('type') != 'checkbox' ? el.val() : el.prop("checked");
                submitdata[el.attr('name')] = val;
            });

            //change these things to jquery events of some sort
            //if submitDataCreated returns false, don't add the line
            if (listerator.options.submitDataCreated && !listerator.options.submitDataCreated(submitdata, listerator.element))
                return false;

            var newline = methods['createLine'].call(listerator, submitdata);

            //if lineCreated returns false, don't add the line
            if (listerator.options.lineCreated && !listerator.options.lineCreated(newline, listerator.element))
                return false;

            listerator.submitcontainer.append(newline);
            listerator.lines++;

            //erase data
            if (listerator.options.eraseData)
                listerator.element.find('[data-listerator-erase="true"]').each(function (i, el) { $(el).val(''); });

            return false;
        }
    };

    $.fn.Listerator = function (options) {


        //perform a function
        if (typeof options == 'string') {
            var args = Array.prototype.slice.call(arguments, 1);

            var firstval = null;

            this.each(function () {
                var listerator = $.data(this, 'listerator');
                if (listerator && $.isFunction(methods[options])) {
                    var val = methods[options].apply(listerator, args);
                    if (val && !firstval)
                        firstval = val;
                }
            });

            return firstval || this;
        }

        var options = $.extend({}, $.fn.Listerator.defaultOptions, options);

        //create the listerator
        this.each(function () {
            var element = $(this);
            var listerator = new Listerator(element, options);
            element.data('listerator', listerator);
        });

        return this;
    };

    $.fn.Listerator.defaultOptions = {
        eraseData: true,
        templatelayout: 'simple',
        template: null
    };

    var Listerator = function (element, options) {
        var container;

        var layout = element.clone();

        var wrapper = $('<div />').addClass('listerator-wrapper');
        element.before(wrapper);
        var elementdiv = $('<div />').append(element).appendTo(wrapper);
        var addbutton = $('<button />').text("add").addClass('listerator-button listerator-button-add').button().click(methods['addClick']).appendTo(element);
        var submitcontainer = $('<div />').attr('id', 'submitcontainer').appendTo(wrapper);

        if (options.template) {
            options.template = $(options.template).clone();
            if (options.template.css('display', 'none'))
                options.template.css('display', 'block');
        }

        else if (!options.template)
            options.template = methods['createTemplateFromElement'](element, options);

        this.submitcontainer = submitcontainer;
        this.layout = layout;
        this.element = element;
        this.lines = 0;
        this.options = options;

        /*var listeratorData = {
        submitcontainer: submitcontainer,
        layout: layout,
        element: element,
        lines: 0
        };*/

        //element.data("listeratorData", listeratorData);
        //element.data("listeratorOptions", options);

        submitcontainer.data('element', element);

        return this;
    };
})(jQuery);