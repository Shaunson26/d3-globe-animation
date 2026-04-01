import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//const d3geoX = d3.geoGnomonic
const d3geoX = d3.geoOrthographic

export function initGlobe(canvasSelector) {

    const rootStyles = getComputedStyle(document.documentElement);

    // Retrieve specific theme colors
    const bodyBg = rootStyles.getPropertyValue('--bs-body-bg').trim();

    // Container dimensions
    const canvasElement = document.querySelector(canvasSelector);
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    const canvas = d3.select(canvasElement).attr("width", width).attr("height", height);
    const context = canvas.node().getContext("2d");

    // Projection (think math converter)
    const projection = d3geoX()
        .scale(Math.min(width, height) / 2 * 0.8)
        .translate([width / 2, height / 2])
        .precision(0.1);

    // Path generator (think drawer)
    const path = d3.geoPath(projection, context);

    function render(land, borders, selectedCountry = null, hoveredCountry = null) {

        // Clear the canvas
        context.clearRect(0, 0, width, height);

        // Draw the globe background    
        //context.beginPath();
        //path({ type: "Sphere" });
        //context.fillStyle = "#e3f2fd";
        //context.fill();

        context.beginPath();
        path(land);
        context.fillStyle = "#d1d1d1";
        context.fill();

        if (selectedCountry) {
            context.beginPath();
            path(selectedCountry);
            context.fillStyle = "#ff5722";
            context.fill();
        }

        context.beginPath();
        path(borders);
        //context.strokeStyle = "#fff";
        context.strokeStyle = bodyBg;
        context.lineWidth = 0.5;
        context.stroke();
        
        // Draw the globe outline on top of everything
        context.beginPath();
        path({ type: "Sphere" });
        context.strokeStyle = "#444";
        context.lineWidth = 1;
        context.stroke();

        if (hoveredCountry) {
            context.beginPath();
            path(hoveredCountry);
            context.strokeStyle = "#000";
            context.lineWidth = 1;
            context.stroke();
        }
    }

    return {
        width,
        height,
        projection,
        render,
        canvas,
    };
}

export function computeCountryZoomScale(country, width, height) {
    const projectionCountry = d3geoX()
        .scale(Math.min(width, height) / 2 * 0.8)
        .translate([width / 2, height / 2])
        .precision(0.1)
        .fitSize([width, height], country);

    const rawScale = Math.floor(projectionCountry.scale() * 0.5);
    if (rawScale < 250) return 400;
    if (rawScale > 1000) return 1000;
    return rawScale;
}

export async function animateToCountry(country, projection, render, width, height, selectedCountry, hoveredCountry) {
    const p1 = projection.rotate();
    const center = d3.geoCentroid(country);
    const p2 = [-center[0], -center[1], 0];
    const s1 = projection.scale();
    const s2 = computeCountryZoomScale(country, width, height);

    projection.scale(s1).rotate(p1);

    await d3.transition()
        .duration(1500)
        .tween("rotate-scale", () => {
            const r = d3.interpolate(p1, p2);
            const s = d3.interpolate(s1, s2);
            return t => {
                projection
                    .rotate(r(t))
                    .scale(s(t));
                render(selectedCountry, hoveredCountry);
            };
        })
        .end();
}
