addEventListener('DOMContentLoaded', function(){
    new KevinCarousel('.kevin-carousel').init({
        'gap': 20,
        'draggable': true,
        'loop': true,
        'loopTime': 2500,
        'transitionTime': 500,
        'pauseLoopOnHover': true,
        'button': true,
        'items': 3,
        'responsive': {
            1000: {
                'loop': false
            }
        }
    });
})