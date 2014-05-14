/**
 * Компонент назначения меток
 * @param {Object} config параметры
 * @param {String} config.renderTo id дом элемента в который будет рендерится компонент
 * @param {Array} [config.data] начальные данные в формате {id, text}
 * @constructor
 */
function Tagger(config) {

    /**
     * Дом элемент в который будет отрисовываться компонент
     * @type {null}
     */
    this.containerEl = null;

    /**
     * Контейнер самого компонента. Представляет собой тег ul
     * @type {null}
     */
    this.componentEl = null;

    this.data = [];

    this.buttons = [];


    this.componentEl = $("<ul/>", {class: "tagger"});


    if (config.clickHandler) {
        this.clickHandler = config.clickHandler;
    }

    if (config.renameHandler) {
        this.renameHandler = config.renameHandler;
        this.buttons.push(
            {
                text: "✍",
                handler: this.tagRenameBtnHandler,
                scope: this
            }
        );
    }

    if (config.deleteHandler) {
        this.deleteHandler = config.deleteHandler;
        this.buttons.push(
            {
                text: "✕",
                handler: this.tagDeleteBtnHandler,
                scope: this
            }
        );
    }

    if (config.addHandler) {
        this.addHandler = config.addHandler;

        var appenderEl = this.createTagAppenderEl();

        appenderEl.appendTo(this.componentEl);
    }


    if (config.renderTo) {
        this.containerEl = $("#" + config.renderTo);
        this.containerEl.append(this.componentEl);
    }


    if (config.data) {
        var i;

        for (i = 0; i < config.data.length; ++i) {
            var item = config.data[i];

            this.addTag(item);
        }
    }
}

Tagger.prototype.createTagEl = function (tag) {
    var li;

    if (tag.el) {
        tag.el.empty();
        li = tag.el;
    } else {
        li = $("<li/>");
    }

    if (tag.class) {
        li.addClass(tag.class);
    }

    var caption = $("<span>" + tag.text + "</span>");

    li.append(caption);

    var i;
    for (i = 0; i < this.buttons.length; ++i) {
        var btn = this.buttons[i];
        var btnEl = $("<a>" + btn.text + "</a>");

        btnEl.click(btn, function (event) {
            event.stopPropagation();
            var btn = event.data;
            btn.handler.call(btn.scope, event, tag);
        });

        btnEl.appendTo(li);
    }

    return li;
};

Tagger.prototype.createTagAppenderEl = function () {
    var This = this;

    var appenderEl = $("<li/>", {
        class: "appender"
    });

    var captionEl = $("<span>" + "+ add tag" + "</span>").click(function (event) {
        var me = $(this);
        var input = me.next();

        me.hide();
        input.val("").show().focus();

        input.blur(function () {
            $(this).hide().prev().show();
        });

        input.keypress(function (event) {
            if (event.which == 13) {
                var value = input.val().trim();

                if (!value)
                    return;

                input.val("");

                var newTag = {text: value};
                This.addTag(newTag);
                This.addHandler.call(This, This, newTag);
            }
        });
    });

    var inputEl = $("<input/>").css("display", "none");

    appenderEl.append(captionEl).append(inputEl);

    return appenderEl;
};

Tagger.prototype.addTag = function (source) {
    var This = this;

    var tag = {
        id: source.id,
        text: source.text,
        source: source,
        class: source.class ? source.class : null
    };

    var el = this.createTagEl(tag);

    if (this.clickHandler) {
        el.click(tag, function (event) {
            var tag = event.data;
            This.tagClickHandler(event, tag);
        });
    }

    if (this.addHandler)
        this.componentEl.children().last().before(el);
    else
        this.componentEl.append(el);

    tag.el = el;

    this.data.push(tag);
};

Tagger.prototype.tagClickHandler = function (event, tag) {
    this.clickHandler.call(this, this, tag);
};

Tagger.prototype.tagRenameBtnHandler = function (event, tag) {
    var This = this;

    tag.el.children("span").remove();

    var inputEl = $("<input/>").val(tag.text).prependTo(tag.el);
    inputEl.focus();

    inputEl.blur(function () {
        This.createTagEl(tag);
    });

    inputEl.keypress(function (event) {
        if (event.which == 13) {
            tag.text = inputEl.val().trim();
            This.createTagEl(tag);
            This.renameHandler.call(This, This, tag);
        }
    });
};

Tagger.prototype.tagDeleteBtnHandler = function (event, tag) {
    for (var i = 0; i < this.data.length; ++i) {
        if (this.data[i] == tag) {
            this.data[i].el.remove();
            this.data.splice(i, 1);
            this.deleteHandler.call(this, this, tag);
            break;
        }
    }
};

Tagger.prototype.getTags = function () {
    return this.data;
};

Tagger.prototype.remove = function () {
    for (var i = 0; i < this.data.length; ++i) {
        this.data[i].el.remove();
        this.data[i] = null;
    }

    this.componentEl.remove();

    this.data = null;
};