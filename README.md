﻿# Authorvisual
# Co-authorship Network Visualization

This project visualizes the co-authorship network of authors based on data provided in a CSV file. The graph representation displays nodes as authors, and edges between them indicate co-authorships. The visualization supports interactive features, including zooming, dragging, and node highlighting based on country.

## Features
- Interactive graph visualization with zoom and drag functionality.
- Nodes represent authors, and edges represent co-authorships.
- Nodes are color-coded by country and sized based on citation counts or other selected attributes.
- Hovering over a node highlights other authors from the same country and the edges linking them.
- Clicking on a node displays detailed information about the selected author.

## Requirements

To run this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Optional, for server-side hosting)
- [D3.js](https://d3js.org/) - A JavaScript library for producing dynamic, interactive data visualizations.

## File Structure

- `index.html` - The main HTML file that contains the structure of the webpage and links to external resources (e.g., stylesheets and scripts).
- `style.css` - Custom CSS for styling the graph and other elements on the page.
- `script.js` - The main JavaScript file that contains the logic for generating the graph using D3.js.
- `coauthorship_data.csv` - The CSV file containing the co-authorship data, including author details, countries, and citation counts.
- `README.md` - Documentation for the project.

## Setup

1. Clone or download the project files to your local machine.

   ```bash
   git clone https://github.com/yourusername/coauthorship-network-visualization.git
