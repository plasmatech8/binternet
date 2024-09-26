# BInternet

**BInternet** allows you to inscribe static websites onto the Bitcoin blockchain. By inscribing
website assets and creating a router inscription, your content is permanently stored and accessible
via inscription number and URL paths.

[mainnet](https://binternet.org) • [signet](https://signet.binternet.org)

## Table of Contents
- [BInternet](#binternet)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Documentation](#documentation)
  - [License](#license)

## Features

- Inscribe static websites onto the Bitcoin blockchain.
- Support for HTML, JS, CSS, and images.
- Reference files via inscription numbers.
- Router inscription support to organize URLs and paths.
- Immutable and decentralized web hosting.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/plasmatech8/binternet.git
    cd binternet
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file from the provided example:
    ```bash
    cp .env.example .env
    ```

4. Fill in the environment variables in the `.env` file.

## Usage

1. Start the development server:
    ```bash
    npm run dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) to see the site in action.

## Documentation

For information about the BInternet specifications and step-by-step guides, please read the
documentation page:

- [Official Documentation](https://binternet.org/docs)
- ([Markdown file](/src/routes/(app)/docs/+page.md))

## License

This project is licensed under the MIT License.
