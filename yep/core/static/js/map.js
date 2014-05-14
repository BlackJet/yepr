/**
 * Содержит список компаний представленных на странице. Ключом является id'ик компании
 * @type {{}}
 */
var companyList = {};


/**
 * Создает экземпляр Company
 * @param companyAttributes
 * @this {Company}
 * @constructor
 */
function Company(companyAttributes){
    this.id = null;
    this.name = null;
    this.description = null;
    this.latitude = null;
    this.longitude = null;

    this.map = null;

    $.extend(this, companyAttributes);

    this.getCoordinatesList = function() {
        return [this.latitude, this.longitude]
    }
}


/**
 * Формирует объект Company из дом представления компании.
 * @param {jQuery} el jQuery объект содержащий dom элемент содержащий данные компании
 * @returns {Company}
 */
function parseCompany(el) {
    var id = el.data("id");
    var latitude = el.data("latitude");
    var longitude = el.data("longitude");
    var name = el.children("h1").text();
    var description = el.children("p").text();

    return new Company({
        id: id,
        name: name,
        description: description,
        latitude: latitude,
        longitude: longitude
    });
}


function createMap(renderTo, companies, centerCompany) {
    var mapMarks = [];

    $.each(companies, function(index, company){
        var mark = new ymaps.Placemark(company.getCoordinatesList(), {
            iconContent: company.id == centerCompany.id? company.name: company.id,    // Текст отображаемый на значке
            hintContent: company.name  // Хинт всплывающий при наведении указателя на метку
        },{
            preset: company.id == centerCompany.id? "twirl#greenStretchyIcon": "twirl#brownIcon"
        });

        mapMarks.push(mark);
    });

    var map = new ymaps.Map(renderTo, {
        center: centerCompany.getCoordinatesList(),
        zoom: 14,
        behaviors:['default', 'scrollZoom'] // Можно перетаскивать и масштабировать колесиком
    });

    $.each(mapMarks, function(index, mark){
        map.geoObjects.add(mark);
    });

    map.controls
        // Кнопка изменения масштаба.
        .add('zoomControl', { left: 5, top: 5 })
        // Список типов карты
        .add('typeSelector');


    return map;
}

$(function(){
    $(".company-list-item").
        each(function () {
            var el = $(this);
            var company = parseCompany(el);
            window.companyList[company.id] = company;
        });

    $(".show-map").
        click(function (event) {
            event.preventDefault(); // Нужно чтобы страница не прокручивалась к началу при раскрытии карты. Можно убрать указав в ссылке атрибут href="javascript:void(0)"

            var companyEl = $(this).parent();
            var mapPlaceEl = companyEl.children(".map-place");

            var id = companyEl.data("id");
            var selectedCompany = window.companyList[id];

            if (selectedCompany.map == null) {  // Не даем повторно создавать карту если её уже открывали
                selectedCompany.map = createMap(mapPlaceEl[0], window.companyList, selectedCompany);
            }

            $(this).hide();
            companyEl.children(".hide-map").show();

            mapPlaceEl.show(0,function(){
                selectedCompany.map.container.fitToViewport();
            });
        });

    $(".hide-map").
        click(function (event) {
            event.preventDefault();

            var companyEl = $(this).parent();

            $(this).hide();
            companyEl.children(".show-map").show();
            companyEl.children(".map-place").hide();
        });
});