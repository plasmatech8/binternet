# Modular Site

> [!IMPORTANT]
> This site has not yet implemented.

The goal is to create a site with a modular architecture so that it can be updated in the future
with the fewest number of new inscription transactions required and the lowest fees.

## Features

This site has the following features:
* SPA routing using [petite-router](https://github.com/plasmatech8/petite-router)
  * Improves inscription re-usability and makes it cheaper to create new versions of the site.
  * Each page and layouts can be it's own inscription, so you do not need to re-inscribe every single page when you change a layout.
* Basic styles using [Simple.css](https://github.com/kevquirk/simple.css)
  * A convenient pre-made set of styles.
  * This is not mandatory, you can create your own CSS stylesheets which may work better.
* Reactivity using [Petite-Vue](https://github.com/vuejs/petite-vue)
  * A convenient way to implement reactivity and DOM manipulation in our HTML markup.
  * This is not mandatory, you can use your own vanilla JavaScript files which may work better.
