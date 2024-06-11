# Documentation

## Overview

You can inscribe a static website onto the Bitcoin blockchain.

This can be done by inscribing a HTML files onto the chain.

Your HTML file contents can then be accessed via inscription number or inscription ID.

Further on this, you can create a **router** inscription in order to create a website
similar to a traditional website - one where URL paths are configured to contain different
resources/files.

e.g.
```yaml
binternet: v1
routes:

  # HTML
  /: 100001        # homepage.html
  /runes: 100002   # runes.html

  # JS/CSS
  /script.js: 100003
  /styles.css: 100004

  # Image Assets
  /runes/going_to_the_moon.gif: 100005
  /runes/laser_eyes_effect.gif: 100006
  /favicon.gif: 100007
```

This allows you to reference other inscriptions via URL paths exactly like you would with a normal
website.

A **router** inscription is essentially you website, and the inscription number is your domain name.

> If you want to update your website, you need to inscribe new files onto the blockchain
> and then create a new router which points to the new inscription numbers.
>
> You should try to re-use existing inscriptions as much as possible.

## How to Create a Site

1. Create inscriptions with data containing file data for the assets of your site (or take note of the inscription number for any existing inscriptions your site is using)
   1. HTML, JS, CSS, images, etc...
2. Create a router inscription which consists of a YAML file with the specified schema which maps URL paths to inscription numbers

## Router Specification

```yaml
binternet: <VERSION>
routes:
  <URL_PATH>: <INSCRIPTION_NUMBER>
  # ...
```

### Version

`v1` is the currently the only version available.

### Routes

URL paths use glob syntax.

- `*` matches a single file/folder
- `**` matches zero or more folders

URL paths must start with `/`.

If multiple paths match for the current URL, then the path with the highest specificity will be
used.

#### Example

For example, the router below defines 3 routes:

```yaml
binternet: v1
routes:
  /foo: 100001
  /foo/*: 100002
  /foo/**: 100003
```

- `/foo` will always only match the `/foo` route. This route also matches `/foo/**` but this has lower specificity.
- `/foo/bar` matches the `/foo/*` route. This route also matches `/foo/**` but this has lower specificity.
- `/foo/bar/baz` only matches `/foo/**`.

When the user navigates to a route on your site,
the data for the corresponding inscription will be sent to the browser.

- `<route-inscription-number>.binternet.org/foo/bar` -> 100002 -> "my_image.png"