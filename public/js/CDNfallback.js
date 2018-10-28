fallback.load({
    JSON: '//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2.min.js',
    BootstrapCSS: [
        '//stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.cs'
    ],
    Bootstrap: [
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.min.js'
    ],
    jQuery: [
        '//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js'
    ],
    'jQuery.ui': [
        '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js',
        '//js/loader.js?i=vendor/jquery-ui.min.js'
    ],
    Popper: [
        '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js'
    ],
}, {
    shim: {
        'jQuery.ui': ['jQuery']
    },
});