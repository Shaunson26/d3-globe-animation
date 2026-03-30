import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { findCountryByPoint, randomCountry } from "./data.js";
import { showHoverLabel, hideHoverLabel, updateCountryInfo } from "./ui.js";
import { animateToCountry } from "./globe.js";

export function setupInteractions(globe, data) {
    let selectedCountry = null;
    let hoveredCountry = null;

    globe.render(data.land, data.borders, selectedCountry, hoveredCountry);

    globe.canvas.on("mousemove", function (event) {
        const [x, y] = d3.pointer(event);
        const country = findCountryByPoint(globe.projection, [x, y]);
        hoveredCountry = country || null;
        globe.render(data.land, data.borders, selectedCountry, hoveredCountry);

        if (country) {
            showHoverLabel(country.properties.admin, x, y);
        } else {
            hideHoverLabel();
        }
    });

    globe.canvas.on("mouseout", function () {
        hoveredCountry = null;
        globe.render(data.land, data.borders, selectedCountry, hoveredCountry);
        hideHoverLabel();
    });

    d3.select("#tour-btn").on("click", async () => {
        const country = randomCountry();
        selectedCountry = country;
        updateCountryInfo(country);

        await animateToCountry(country, globe.projection, (selected, hovered) => {
            globe.render(data.land, data.borders, selected, hovered);
        }, globe.width, globe.height, selectedCountry, hoveredCountry);

        globe.render(data.land, data.borders, selectedCountry, hoveredCountry);
    });
}
