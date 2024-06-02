# eCommerce App

<!-- <p align="left">
<a href="https://github.com/nil2022/ecommerce/actions/workflows/vulnerability-check.yml" target="_blank"><img src="https://github.com/nil2022/ecommerce/actions/workflows/vulnerability-check.yml/badge.svg?branch=master" alt="Node.js Vulnerability Check" /></a> -->
<a href="https://github.com/nil2022/ecommerce/actions/workflows/github-code-scanning/codeql" target="_blank"> <img src="https://github.com/nil2022/ecommerce/actions/workflows/github-code-scanning/codeql/badge.svg?branch=master" alt="CodeQL" /></a>
</a>
</p>

This is an eCommerce app built with Node.js and MySQL/PostgreSQL as the database.

## Table of Contents

- [eCommerce App](#ecommerce-app)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)

## Introduction

The eCommerce app is a web application that allows users to browse and purchase products online. It provides a user-friendly interface for customers to view product listings, add items to their cart, and complete the checkout process.

The app is built with Node.js as the server-side framework and uses MySQL or PostgreSQL as the database management systems.

## Features

- User authentication and registration
- Product browsing and searching
- Shopping cart functionality
- Order management

## Requirements

To run the eCommerce app, you need to have the following software/database installed:

- Node.js
- MySQL/PostgreSQL

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ecommerce-app.git
   ```
2. Install the required dependencies:

   ```bash
   npm install
   ```
3. Set up the database:

   - Create a MySQL/PostgreSQL database for user information & transactions, product data and inventory.

4. Configure the app:

   - Update the database connection settings in the ```db.config.js``` file.

5. Run the app:

   ```bash
   npm start
   ```
6. Access the app in your web browser:
   
   ```bash
   http://localhost:3000
   ```
## Usage

   - Register a new user account or log in with an existing account.
   - Browse the product listings and add items to your cart.
   - View your order history and manage your account settings.

## Contributing

   Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.