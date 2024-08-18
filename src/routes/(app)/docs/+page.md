# Documentation

## Introduction

This documentation provides an overview and step-by-step guide on how to inscribe a static website
onto the Bitcoin blockchain using HTML files and router inscriptions.

## Overview

You can inscribe a static website onto the Bitcoin blockchain.
This process involves inscribing HTML files onto the chain where the content can be accessed via inscription number or ID.
Afterwards, you can create a **router** inscription to structure your website with URL paths,
similar to a traditional website.

### Creating a Router Inscription

A router inscription allows you to create a structured website by mapping URL paths to different
resources or files using a YAML configuration.
Each path in under `routes` maps to an inscription number.
The inscription data corresponding to the number will be returned when the user navigates to a URL
which matches the path.

Example:
```yaml
binternet: v1
routes:

  # HTML
  /: 100001         # homepage.html
  /runes: 100002    # runes.html
  /about: 100003    # about.html
  /contact: 100004  # contact.html

  # JS/CSS
  /script.js: 100005
  /styles.css: 100006

  # Image Assets
  /runes/going_to_the_moon.gif: 100007
  /runes/laser_eyes_effect.gif: 100008
  /favicon.gif: 100009
```

## Router Specification

A **router** inscription is the configuration which defines the routes for your website.

The inscription number for the router can be thought as similar to a (permanent) static IP address
and can be used as the entry point for your site.

### YAML Schema
```yaml
binternet: <VERSION>
routes:
  <URL_PATH>: <INSCRIPTION_NUMBER>
  # ...
```

### Version

`v1` is the currently available version.

### Routes

URL paths use glob syntax.
- `*` matches a single file/folder
- `**` matches zero or more folders

URL paths must start with `/`.

If multiple router paths match a URL, the first matching path is used.

#### Example

```yaml
binternet: v1
routes:
  /foo: 100001
  /foo/*: 100002
  /foo/**: 100003
```

- `/foo` matches the `/foo` route.
- `/foo/bar` matches the `/foo/*` route.
- `/foo/bar/baz` matches `/foo/**`.

## How to Create a Site

### Step-by-Step Guide

1. **Create Inscriptions**
   - Inscribe data containing file data for the assets of your site (HTML, JS, CSS, images, etc.).
   - Note the inscription number for each asset.
   - If an inscription with identical data already exists, you can forgo creating a new inscription and note the inscription number for the existing asset.

   **Example**:
   - Inscribe `index.html` (inscription number: 100001)
   - Inscribe `about.html` (inscription number: 100002)
   - Inscribe `favicon.png` (inscription number: 100003)
   - Inscribe `frog.gif` (inscription number: 100004)

2. **Create a Router Inscription**
   - Create a YAML file following the specified schema.
   - Map URL paths to corresponding inscription numbers.

    **Example**:
    ```yaml
    binternet: v1
    routes:
      /: 100001
      /about: 100002
      /favicon.png: 100003
      /images/frog.gif: 100004
    ```

3. **Deploy Your Site**
   - Inscribe your router YAML file onto the blockchain.
   - Use the inscription number of your router as your site's entry point.
   - Access your site under URL: `<router-inscription-number>.binternet.org`.

## Examples

See examples in [on GitHub](https://github.com/plasmatech8/binternet/tree/main/examples).

## Best Practices

- **Updating Your Website:** Inscribe new files and create a new router to update your website.
- **Reusing Existing Inscriptions:** Reuse existing inscriptions as much as possible to save space and costs.
- **Validation**: Always check your YAML configuration to ensure there are no syntax errors.

## Error Handling and FAQs

### Common Errors

1. **Incorrect Inscription Numbers**
   - Ensure inscription numbers in the YAML file are correct.

2. **Syntax Errors in YAML**
   - Validate your YAML file to avoid syntax errors.

3. **My inscription is not working**
    - Complex inscriptions using advanced features like relationships with other inscriptions are not currently supported as they require additional JavaScript to render. (parents inscriptions, recursion, etc)
    - Check if an inscription works by opening the link: e.g., <a href="/api/inscription/7850607/content" target="_blank">https://binternet.org/api/inscription/7850607/content</a>

### FAQs

1. **Can I reuse existing inscriptions?**
   - Yes, reusing existing inscriptions is recommended. You can also use other inscriptions created by other people as they cannot be modified.

2. **How do I update my site?**
   - Inscribe new files and create a new router inscription with routes which correspond to the new inscription numbers. Like any inscription, when a router is inscribed, the site is immutable and cannot be changed. You must create a new one and use the inscription number for the new router to access the new version of the site.

3. **Can I have a "string" Bitcoin domain name? (instead of using inscription number)**
   - A Bitcoin domain name is not currently supported. Using a proper domain name could be beneficial, but this may require a new type of ordinal asset to be implemented at the protocol level, which is not in the scope of this project.

## Conclusion

Inscribe static websites onto the Bitcoin blockchain using HTML files and router inscriptions.
Follow the guidelines and best practices provided to create and manage your site efficiently.
