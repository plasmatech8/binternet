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
  /: 100001
  /runes: 100002

  # JS/CSS
  /script.js: 100003
  /styles.css: 100004

  # Images
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
