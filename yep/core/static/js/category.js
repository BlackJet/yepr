/**
 * Компонент выбора категорий
 * @param {Object} config объект содержащий параметры компонента
 * @param {String} config.renderTo jQuery селектор к элементу в который будут выводится категории для выбора
 * @param {String} [config.selectsRenderTo] jQuery селектор к элементу в который будут выводится выбранные пользователем категории
 * @param {Array} config.data список категорий для выбора пользователем. Каждый элемент должен содержать поля id, name, idParent
 * @param {Function} [config.renameHandler] callback вызываемый при зменении названия категории.
 * @param {Function} [config.addHandler] callback вызываемый при создании новой категории.
 * @param {Function} [config.deleteHandler] callback вызываемый при удалении категории.
 * @param {Function} [config.scope] scope в котором будт выполняться callback'и
 * @constructor
 */
function CategorySelector(config) {
    this.container = $(config.renderTo);
    this.selectsContainer = config.renderSelectedTo ? config.renderSelectedTo : null; // TODO: rename to selectsRenderTo

    this.renameHandler = config.renameHandler ? config.renameHandler : null;
    this.addHandler = config.addHandler ? config.addHandler : null;
    this.deleteHandler = config.deleteHandler ? config.deleteHandler : null;

    this.selectedCategories = [];

    var cats = this.makeCategories(config.data);

    this.rootCategory = cats.rootCategory;
    this.allCategories = cats.allCategories;    //TODO: избавиться от этого


    if (this.selectsContainer) {
        this.createSelectsLevel();
    }

    if (this.container) {
        this.createCategoryLevel(this.rootCategory, null);
    }
}

CategorySelector.prototype.makeCategories = function (data) {
    var This = this;

    var catsDict = {};
    var rootCat = {id: null, childs: [], text: null, parent: null, idParent: null};

    catsDict[null] = rootCat;

    $.each(data, function (i, item) {
        catsDict[item.id] = {
            id: item.id,
            name: item.name,
            text: item.name,
            idParent: item.parent_id,
            childs: [],
            selected: item.selected?true:false
        };

        if(item.selected){
            This.selectedCategories.push(catsDict[item.id]);
        }
    });

    $.each(catsDict, function (i, item) {
        if (!item.id)
            return;

        if (!item.idParent) {
            item.parent = rootCat;
            rootCat.childs.push(item);
        } else {
            item.parent = catsDict[item.idParent];
            catsDict[item.idParent].childs.push(item);
            catsDict[item.idParent].class = "node";
        }
    });

    return {rootCategory: rootCat, allCategories: catsDict};
};

CategorySelector.prototype.createCategoryLevel = function (category, idParent) {
    var This = this;

    var tagger = new Tagger({
        renderTo: this.container[0].id,
        data: category.childs,
        clickHandler: function (tagger, tag) {
            var cat = tag.source;

            if (cat.childs.length > 0 || This.addHandler) {
                var tags = tagger.getTags();

                for (var i = 0; i < tags.length; ++i) {
                    if (tags[i].source != cat && tags[i].source.expanded) {
                        tags[i].el.removeClass("expanded");
                        This.collapseCategory(tags[i].source);
                    }
                }

                if (cat.childs && !cat.expanded) {
                    tag.el.addClass("expanded");
                    tag.source.expanded = true;
                    This.createCategoryLevel(cat, null);
                }
            } else {
                if (This.selectsTagger) {
                    if (!cat.selected) {
                        This.selectsTagger.addTag(cat);
                        cat.selected = true;
                        This.selectedCategories.push(cat);
                    }
                }
            }
        },
        addHandler: !This.addHandler ? null : function (tagger, tag) {
            var newCategory = {
                text: tag.text,
                parent: category,
                childs: []
            };

            tag.source = newCategory;

            category.childs.push(newCategory);

            This.addHandler.call(This, This, newCategory);
        },
        deleteHandler: !This.deleteHandler ? null : function (tagger, tag) {
            var category = tag.source;

            This.deleteCategory(category);

            This.deleteHandler.call(This, This, category);
        },
        renameHandler: !This.renameHandler ? null : function (tagger, tag) {
            tag.source.text = tag.text;

            This.renameHandler.call(This, This, tag.source);
        }
    });

    category.tagger = tagger;
};

CategorySelector.prototype.collapseCategory = function (category) {
    if (category.tagger) {

        for (var i = 0; i < category.childs.length; ++i) {
            this.collapseCategory(category.childs[i]);
        }

        category.expanded = false;

        category.tagger.remove();
        category.tagger = null;
    }
};

CategorySelector.prototype.deleteCategory = function (category) {
    if (category.tagger) {
        this.collapseCategory(category);
    }

    var i;
    if (category.parent) {
        for (i = 0; i < category.parent.childs.length; ++i) {
            if (category.parent.childs[i] == category) {
                category.parent.childs.splice(i, 1);
                break;
            }
        }
    }

    if (category.childs.length > 0) {
        for (i = 0; i < category.childs.length; ++i) {
            category.childs[i].parent = null;
            this.deleteCategory(category.childs[i]);
        }
        category.childs = null;
    }
};

CategorySelector.prototype.createSelectsLevel = function () {
    var This = this;

    this.selectsTagger = new Tagger({
        renderTo: this.selectsContainer,
        data: this.selectedCategories,
        deleteHandler: function(tagger, tag){
            var category = tag.source;

            category.selected = false;

            for(var i=0; i< This.selectedCategories.length; ++i){
                if(This.selectedCategories[i] == category){
                    This.selectedCategories.splice(i, 1);
                }
            }
        }
    });
};

CategorySelector.prototype.getSelectedItems = function(){
    return this.selectedCategories;
};