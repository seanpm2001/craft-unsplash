$(document).ready(function () {
    var $grid = $('.splashing-container').masonry({
        itemSelector: 'none', // select none at first
        columnWidth: '.splashing-image-sizer',
        gutter: 20,
        percentPosition: true,
        stagger: 20,
        visibleStyle: {transform: 'translateY(0)', opacity: 1},
        hiddenStyle: {transform: 'translateY(100px)', opacity: 0},
        status: '.page-load-status'
    });

    $grid.imagesLoaded(function () {
        $grid.removeClass('are-images-unloaded');
        $grid.masonry('option', {itemSelector: '.splashing-image-grid'});
        var $items = $grid.find('.splashing-image-grid');
        $grid.masonry('appended', $items);
        $('.splashing-attribute').show();
    });

    var msnry = $grid.data('masonry');

    $grid.infiniteScroll({
        scrollThreshold: 200,
        path: '.js-pagination__next',
        elementScroll: '#content',
        append: '.splashing-image-grid',
        outlayer: msnry,
        status: '.page-load-status',
        hideNav: '.pagination',
        historyTitle: true,
        history: 'push',
        debug: true,
    });

    $grid.on( 'append.infiniteScroll', function( event, response, path, items ) {
        $('.splashing-attribute').show();
    });

    $('#content').on('click', '.splashing-image', function (e) {
        var $image = $(this);

        payload = {}
        payload['id'] = $image.data('id');
        payload[window.csrfTokenName] = window.csrfTokenValue;

        $.ajax({
            type: 'POST',
            url: Craft.getActionUrl('splashing-images/download'),
            dataType: 'JSON',
            data: payload,
            beforeSend: function () {
                $image.parent().addClass('saving');
            },
            success: function (response) {
                $image.parent().removeClass('saving');
                Craft.cp.displayNotice(Craft.t('splashing-images', 'Image saved!'));
            },
            error: function (xhr, status, error) {
                $image.parent().removeClass('saving');
                Craft.cp.displayError(Craft.t('splashing-images', 'Oops, something went wrong...'));
            }
        });
    });
});
