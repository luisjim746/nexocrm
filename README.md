# NexoCRM

A mini CRM dashboard built with HTML, CSS, and vanilla JavaScript to practice real-world frontend patterns such as dynamic rendering, filtering, form handling, inline status editing, dashboard metrics, and client-side persistence with localStorage.

## Live Demo
[View the live project](https://luisjim746.github.io/nexocrm/)

## Preview

### Dashboard
![NexoCRM dashboard](./assets/nexocrm-dashboard.png)

### Add client form
![NexoCRM add client form](./assets/nexocrm-form.png)

### Mobile view
![NexoCRM mobile view](./assets/nexocrm-mobile.png)

## Repository
[View the source code](https://github.com/luisjim746/nexocrm)

## Overview

NexoCRM is a frontend-focused mini CRM created as a portfolio project to simulate a modern SaaS-style internal tool.

The project started as a static dashboard layout and gradually evolved into an interactive application where users can manage client records, filter data, update statuses, validate form inputs, and persist changes in the browser.

The main goal of this project was to move beyond basic UI building and practice the kind of logic often found in business software.

## Features

- Modern SaaS-style dashboard UI
- Dynamic client table rendered from JavaScript data
- Search by client name or company
- Filter by status
- Filter by priority
- Inline status editing directly in the table
- Dynamic dashboard metrics
- Side panel form to add new clients
- Basic form validation with inline error messages
- Data persistence with localStorage
- Responsive layout for smaller screens

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage API

## Project Structure

nexocrm/  
├── index.html  
├── styles.css  
├── data.js  
├── app.js  
└── README.md  

### File Responsibilities

- `index.html` → application structure and layout
- `styles.css` → visual styles and component presentation
- `data.js` → mock client data used as the initial source of truth
- `app.js` → rendering, filters, metrics, form logic, inline editing, and persistence

## Key Learnings

This project helped me practice:

- DOM manipulation
- event handling
- rendering UI from arrays of objects
- combining multiple filters on the same dataset
- form handling and validation
- updating UI after state changes
- client-side persistence with localStorage
- structuring a larger vanilla JavaScript project in a more organized way

It also helped me understand a key frontend idea: the interface should reflect the current data, not the other way around.

## Challenges

Some of the main challenges in this project were:

- turning a static dashboard into a dynamic application
- keeping the table, filters, and metrics in sync
- handling multiple filters at the same time
- validating form data without overcomplicating the logic
- updating a client inline while preserving the current filtered view
- persisting changes in localStorage and reloading them correctly

## Reusable Patterns Practiced

This project includes several patterns that can be reused in future frontend work:

- array of objects as the source of truth
- data-to-UI rendering with `map()` and template literals
- filter pipeline with derived views
- shared UI state for filters
- capture → validate → save form flow
- inline data editing
- local persistence with `JSON.stringify()` and `JSON.parse()`
- small functions with a single responsibility

## Future Improvements

Possible next steps for a future version:

- edit full client details
- delete clients
- add sorting options
- improve accessibility
- split logic into smaller modules
- rebuild the project in React
- connect the app to a real backend and database

## Setup

To run the project locally:

1. Clone the repository
2. Open the project folder
3. Open `index.html` in the browser

You can also run it with a local server such as Live Server in VS Code.

## Why This Project Matters

NexoCRM was built to practice the kind of frontend logic often seen in internal business tools:

- dashboards
- data tables
- filters
- editable states
- forms
- validation
- browser persistence

It is both a learning project and a portfolio piece that reflects how I approach frontend development in a practical, product-oriented way.

## Author

Built by Luis Jiménez.
