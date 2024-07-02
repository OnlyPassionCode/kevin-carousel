
# KevinCarousel
KevinCarousel est une bibliothèque JavaScript légère pour créer des carrousels d'images avec des fonctionnalités personnalisables telles que le glissement, la boucle, et les boutons de navigation.

## Installation
Ajoutez le script de KevinCarousel à votre projet. Vous pouvez le faire en téléchargeant le fichier JavaScript et en l'incluant dans votre fichier HTML :
```javascript
<script src="path/to/kevin-carousel.js"></script>
```

## Utilisation
Créez une instance de KevinCarousel et initialisez-la avec les options désirées :

```javascript
new KevinCarousel('.kevin-carousel').init({
    'gap': 20,
    'draggable': true,
    'loop': true,
    'loopTime': 2500,
    'transitionTime': 500,
    'pauseLoopOnHover': true,
    'button': true,
    'items': 3,
});
```
## Options
- gap (number) : Espace en pixels entre les éléments du carrousel. Par défaut : 10.
- draggable (boolean) : Permet le glissement des éléments avec la souris. Par défaut : true.
- loop (boolean) : Active la boucle automatique du carrousel. Par défaut : true.
- loopTime (number) : Temps en millisecondes entre chaque itération de la boucle. Par défaut : 1800.
- transitionTime (number) : Temps en millisecondes de la transition entre les éléments. Par défaut : 250.
- pauseLoopOnHover (boolean) : Met en pause la boucle automatique lorsque la souris survole le carrousel. Par défaut : true.
- button (boolean) : Affiche les boutons de navigation. Par défaut : false.
- items (number) : Nombre d'éléments visibles dans le carrousel. Par défaut : 3.

## Exemple Complet
Voici un exemple complet d'utilisation de KevinCarousel dans un fichier HTML :

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="path/to/kevin-carousel.css">
    <title>KevinCarousel Example</title>
</head>
<body>
    <div class="kevin-carousel">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
    </div>

    <script src="path/to/kevin-carousel.js"></script>
    <script>
        new KevinCarousel('.kevin-carousel').init({
            'gap': 20,
            'draggable': true,
            'loop': true,
            'loopTime': 2500,
            'transitionTime': 500,
            'pauseLoopOnHover': true,
            'button': true,
            'items': 3,
        });
    </script>
</body>
</html>
```
## Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.