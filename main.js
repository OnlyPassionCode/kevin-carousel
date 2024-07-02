addEventListener('DOMContentLoaded', function(){
    new KevinCarousel('.kevin-carousel').init({
        'gap': 20,
        'draggable': true,
        'loop': true,
        'loopTime': 2500,
        'pauseLoopOnHover': true,
        'button': true,
        'items': 3,
    });
})