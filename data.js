import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from 'https://cdn.jsdelivr.net/npm/topojson-client@3/+esm';
import world from "./assets/countries-medium-rne.json" with { type: "json" };

const land = topojson.feature(world, world.objects.countries);
const countries = topojson.feature(world, world.objects.countries).features;
const borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
const countryNames = countries.map(d => d.properties.admin);

function formatNumber(value) {
    if (value == null) return "";
    return value.toLocaleString();
}

function countryFlagUrl(country) {
    return country && country.properties.iso_a2
        ? `https://flagcdn.com/w320/${country.properties.iso_a2.toLowerCase()}.png`
        : "";
}

function findCountryByPoint(projection, point) {
    const coords = projection.invert(point);
    if (!coords) return null;
    return countries.find(country => d3.geoContains(country, coords));
}

function randomCountry() {
    return countries[Math.floor(Math.random() * countries.length)];
}

export {
    land,
    countries,
    borders,
    countryNames,
    findCountryByPoint,
    randomCountry,
    formatNumber,
    countryFlagUrl,
};
