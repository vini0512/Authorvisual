// Set the dimensions for the SVG container to full screen
const width = window.innerWidth;
const height = window.innerHeight;

// Create the SVG element for the main visualization
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
    }));

// Create a group for the zoomable area
const zoomGroup = svg.append("g");

// Load the JSON data
d3.json("author_network_data_with_links.json").then(data => {
    console.log("Data loaded:", data);

    // Calculate degree (number of connections) for each node
    const degreeMap = {};
    data.links.forEach(link => {
        degreeMap[link.source] = (degreeMap[link.source] || 0) + 1;
        degreeMap[link.target] = (degreeMap[link.target] || 0) + 1;
    });

    // Apply the degree count to each node in the dataset
    data.nodes.forEach(node => {
        node.degree = degreeMap[node.name] || 0;
    });

    // Set up a scale for node size based on degree
    const sizeScale = d3.scaleSqrt()
        .domain(d3.extent(data.nodes, d => d.degree))
        .range([3, 12]);

    // Determine the unique countries in the data
    const countries = Array.from(new Set(data.nodes.map(d => d.country)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

    // Set up the force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.name).strength(0.5))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => sizeScale(d.degree) + 2));  // Adjusted for node size

    // Draw links
    const link = zoomGroup.append("g")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5);

    // Draw nodes with size based on degree
    const node = zoomGroup.append("g")
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", d => sizeScale(d.degree))  // Use the size scale
        .attr("fill", d => colorScale(d.country))
        .call(drag(simulation));

    // Tooltip setup
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("padding", "10px")
        .style("display", "none");

    // Node interactivity
    node
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`<strong>${d.name}</strong><br>Country: ${d.country}<br>Connections: ${d.degree}`);
            node.attr("opacity", n => n.country === d.country ? 1 : 0.2);
        })
        .on("mousemove", event => {
            tooltip.style("top", (event.pageY + 5) + "px")
                .style("left", (event.pageX + 5) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
            node.attr("opacity", 1);
        })
        .on("click", (event, d) => {
            // Show affiliation information on click
            tooltip.style("display", "block")
                .html(`<strong>${d.name}</strong><br>Country: ${d.country}<br>Affiliation: ${d.affiliation || "Not available"}`)
                .style("top", (event.pageY + 5) + "px")
                .style("left", (event.pageX + 5) + "px");
        });

    // Update positions on each simulation tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Fixed Legend Container (outside zoomable area)
    const legendContainer = d3.select(".legend");

    // Clear any previous legend items to avoid duplicates
    legendContainer.selectAll(".legend-item").remove();

    // Add a legend item for each country
    countries.forEach(country => {
        const legendItem = legendContainer.append("div").attr("class", "legend-item");

        legendItem.append("div")
            .style("background-color", country === "Other" ? "#A9A9A9" : colorScale(country))
            .style("width", "15px")
            .style("height", "15px")
            .style("display", "inline-block")
            .style("margin-right", "10px");

        legendItem.append("span").text(country);
    });

    // UI controls for force parameters
    d3.select("#forceStrength").on("input", function() {
        simulation.force("charge").strength(+this.value);
        simulation.alpha(1).restart();
    });

    d3.select("#collisionRadius").on("input", function() {
        simulation.force("collide").radius(d => sizeScale(d.degree) + +this.value);
        simulation.alpha(1).restart();
    });

    d3.select("#linkStrength").on("input", function() {
        simulation.force("link").strength(+this.value);
        simulation.alpha(1).restart();
    });
}).catch(error => console.error("Error loading data:", error));

// Drag behavior function for nodes
function drag(simulation) {
    return d3.drag()
        .on("start", event => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        })
        .on("drag", event => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        })
        .on("end", event => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        });
}
