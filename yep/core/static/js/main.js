function parseCompany(el) {
    var id = el.parent().data("id");
    var latitude = el.data("latitude");
    var longitude = el.data("longitude");
    var name = el.prev("h5").text();
    var description = "description"; //el.children("p").text(); // TODO указать элемент в котором описание

    return {
        id: id,
        name: name,
        description: description,
        latitude: latitude,
        longitude: longitude
    };
}

function createMap(renderTo, companies, centerCompany) {
    var mapMarks = [];

    $.each(companies, function(index, company){
        var mark = new ymaps.Placemark([company.latitude, company.longitude], {
            iconContent: company.id == centerCompany.id? company.name: company.id,    // Текст отображаемый на значке
            hintContent: company.name  // Хинт всплывающий при наведении указателя на метку
        },{
            preset: company.id == centerCompany.id? "twirl#greenStretchyIcon": "twirl#brownIcon"
        });

        mapMarks.push(mark);
    });

    var map = new ymaps.Map(renderTo, {
        center: [centerCompany.latitude, centerCompany.longitude],
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

function prepareMap() {
    var companies = {};

    $(".company-list-item address").
        each(function () {
            var el = $(this);
            var company = parseCompany(el);
            companies[company.id] = company;
        });

    $(".show-map").
        click(function (event) {
            event.preventDefault(); // Нужно чтобы страница не прокручивалась к началу при раскрытии карты. Можно убрать указав в ссылке атрибут href="javascript:void(0)"

            var companyEl = $(this).parents("div.company-list-item");
            var mapPlaceEl = $(this).parent().siblings(".map-place");

            var id = companyEl.data("id");
            var selectedCompany = companies[id];

            if (selectedCompany.map == null) {  // Не даем повторно создавать карту если её уже открывали
                selectedCompany.map = createMap(mapPlaceEl[0], companies, selectedCompany);
            }

            $(this).hide();
            $(this).next(".hide-map").show();

            mapPlaceEl.show(0, function () {
                selectedCompany.map.container.fitToViewport();
            });
        });

    $(".hide-map").
        click(function (event) {
            event.preventDefault();

            var companyEl = $(this).parents("div.company-list-item");

            $(this).hide();
            $(this).siblings(".show-map").show();

            $(this).parent().siblings(".map-place").hide();
        });
}

/**
 *  main
 */

$(function () {

    $('form[name="companyForm"]').submit(function (e) {

        e.preventDefault();
        var form = $('form[name="companyForm"]');
        $.post(form.attr('action'), form.serializeArray());

        return false;

    });


    $('#modal_window').click(function (e) {
        if ($(e.target).closest('.body').length) return;
        $('body').css('overflow', 'auto');
        $(this).hide();
    });

    prepareMap();
    
    
    $(document).on('submit', '#company_edit_form', function (e) {
        e.preventDefault();
        return false
    })
});


window.Category = Backbone.Model.extend({
    urlRoot: "/api/category",
    idAttribute: "id"
});

window.Categories = Backbone.Collection.extend({
    url: "/api/category",
    model: window.Category
});

function previewPhoto (e) {
        var input = e.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var $image = $('#loo');
            reader.onload = function (e) {
                $image.attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
}
function showWindow(id) {
    

    $('#modal_window').show();
    $('body').css('overflow', 'hidden');
    $.ajax({
        url: '/company/' + id + '/edit/',
        async: false,
        success: function (html) {
            $('#modal_window').html(html);

            $('#upload_form').ajaxForm({
                url: '/photo/',
                beforeSubmit: null,
                success: function () {
                    console.log('upload success')
                },
                error: function () {
                    console.log('upload error');
                }
            });

            $(document).on('click', '#upload_choose_btn', function () {
                $('#upload_form').find('[type="file"]').click();

            });

            $(document).on('change', '[type="file"]', function (e) {
                $('#upload_form').submit();

                var input = e.target;
                var ls = $('#company_edit_photo_list');

                if (input.files) {
                    for(var i = 0; i < input.files.length; i++) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var newEl = ls.children(':first').clone().removeClass('hide');
                            ls.append(newEl);
                            var $image = newEl.find('img');
                            $image.attr('src', e.target.result);
                        };

                        reader.readAsDataURL(input.files[i]);
                    }
                }

//                previewPhoto(e);
            });

            var latEl = $("#inputLatitude");
            var lonEl = $("#inputLongitude");

            var lat = parseFloat(latEl.val());
            var lon = parseFloat(lonEl.val());

            if (isNaN(lat) || isNaN(lon)) {
                lat = null;
                lon = null;

                // TODO: получить строку для геокодирования
            }

            createAddressEditMap("addressMapEdit", null, null, function (latitude, longitude) {
                latEl.val(latitude);
                lonEl.val(longitude);
            });
            //---------------------------------------------
            var categories = new Categories();

            categories.fetch({
                success: function (self, response, options) {
                    $("#companyCategories span").each(function () {
                        var id = parseInt($(this).text());
                        self.get(id).set("selected", true);
                    });

                    $("#companyCategories").empty();

                    var tagger = new CategorySelector({
                        renderTo: "#allCategories",
                        renderSelectedTo: "companyCategories",
                        data: self.toJSON()
                    });
                }
            });
        }
    });
}