TODO:
- Readme
  - Update readme.
  - Remove content below.
- Docs
  - Add example sites section
- Create
  - Enable inscribing
  - Add instructions link for URL patterns
  - Minify JS/CSS functions
  - Convert /index.html and /foo.html to / and /foo
  - Implement existing inscription picker modal
- Identical inscription found
  - Add inscription endpoint (params: inscription ID)
  - Get inscription endpoint (params: sha256 hash, response: inscription number + ID)
- Routing
  - Use glob-specificity to order routes
  - Use minimatch to check glob patterns
- Create video tutorial

# btcinternet

## SvelteKit website

Uses a GET endpoint under `subdomain.domain.org` which returns a file from the index for the subdomain.
Uses DNS wildcards.

Under `domain.org/create` there are two forms: (1) Upload Files, (2) Create Index

Under `domain.org/search` there is a search engine.

## Uplaod files

* You can upload individual files or an entire folder.
* It will show the file hashes and a message telling whether the file already exists on the blockchain or not.
* There is a button to upload all files at once.
* After uploading, it will show information including the hashes and the filepaths (for info purposes)

Example output:
```
/users/mark/code/project/index.html -> example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b
/users/mark/code/project/index.css  -> example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b
/users/mark/code/project/index.js   -> example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b
```

## Create index

* If you previously uploaded files, it will populate the index editor for convenience.
* An index points a route/resource path to a file blob (specified by the file hash).

Example index configuration:
```
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.html
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.css
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.js
```

Example output:
```
Index Created   -> c53efdfe9852a39ee612647318025f35f33afb983f8304d0e5350f6a10aa44c7
```

* You can use glob syntax to define wildcard routes.
* You can also add other indexes on top of another route. Use the `%` to append subroutes to the index.

Example:
```
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /same-file-for-all-routes/**/*
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /another-index/%
```

## Example indexes

### Basic single file static page
```
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /            # HTML file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.css   # CSS file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.js    # JS file
```

### Multiple static file pages
```
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /              # HTML file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /foo           # HTML file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /foo/bar       # HTML file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /foo/bar/baz   # HTML file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.css     # CSS file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.js      # JS file
```


### SPA using petite-vue, navaid and simplecss
```
# Libraries
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /simple.min.css      # CSS library file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /petite-vue.iife.js  # JS libary file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /navaid.min.js       # JS library file

# Assets
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.css           # CSS file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.js            # JS file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /index.html          # HTML route file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /foo/index.html      # HTML route file
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /foo/bar/index.html  # HTML route file

# SPA route
example_sha256_hash_d31fdc047fab76a2b7ce91352a029f27ce7f15ad401b /**/*                # HTML layout with SPA router which reads the other HTML files
```
