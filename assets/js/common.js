// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    // clamp long abstracts and add a read more / show less toggle
    $('.abstract-text').each(function () {
        var $abs = $(this).addClass('clamped');
        var $toggle = $('<a class="small abstract-toggle">Read more</a>');
        $toggle.on('click', function () {
            var expanded = !$abs.toggleClass('clamped').hasClass('clamped');
            $toggle.text(expanded ? 'Show less' : 'Read more');
            $grid.masonry('layout');
        });
        $abs.after($toggle);
    });

    // only show the toggle when the clamped abstract actually overflows
    function updateAbstractToggles() {
        $('.abstract-text.clamped:visible').each(function () {
            $(this).next('.abstract-toggle').toggle(this.scrollHeight > this.clientHeight + 1);
        });
    }
    updateAbstractToggles();
    $(window).on('resize', updateAbstractToggles);

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });
})
