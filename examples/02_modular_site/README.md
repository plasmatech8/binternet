# Modular Site

> [!IMPORTANT]
> This site has not yet implemented.

The goal is to create a site with a strong developer experience, and is modular so that
it can be updated (create new version of the site) with the minimum number of
new inscription required.

## Features

This site has the following features:
* SPA routing using [Navaid](https://github.com/lukeed/navaid)
  * Improves inscription re-usability and makes it cheaper to create new versions of the site.
* Basic styles using [Simple.css](https://github.com/kevquirk/simple.css)
  * A convenient pre-made set of styles.
* Reactivity using [Petite-Vue](https://github.com/vuejs/petite-vue)
  * A convenient way to implement reactivity and DOM manipulation in our HTML markup.

### SPA Routing using Navaid

Define a `router.js` file which will define the SPA page routes for the site.

The `index.html` HTML file will contain our base layout and will import `router.js`.

When the user navigates to a path (e.g. `/hello`) the SPA router will take control,
download the HTML file for the page (e.g. `/html/hello-content.html`),
and the contents will be inject it into the slot in the layout.

This allows us to separate layout code from page code. We do not need to re-inscribe
every page on our website when we want to change the root layout.

When you want to update your site, you only need to inscribe the specific
files that you want to update (HTML/CSS/JS/etc) and a new router (with updated routes
matching the new set of files).

Using this SPA router also reduces total size of the website in bytes because each
page does not need to contain the layout code.

### Basic Styles using Simple.css

A convenient pre-made set of class-less styles.

This is optional. Not recommended if you want to make a custom or more-advanced website.

### Reactivity using Petite-Vue

Improves the developer experience by providing Vue reactivity tooling into your code.

Provides HTML directives for DOM manipulation and events, state management,
and basic tooling for components.
