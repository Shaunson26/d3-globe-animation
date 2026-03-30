import { formatNumber, countryFlagUrl } from "./data.js";

let hoverLabel = null;

export function initUI() {
    const globeCard = document.getElementById("globe");
    if (globeCard) {
        globeCard.style.position = "relative";
    }

    hoverLabel = document.createElement("div");
    hoverLabel.id = "hover-label";
    hoverLabel.style.position = "absolute";
    hoverLabel.style.pointerEvents = "none";
    hoverLabel.style.padding = "6px 10px";
    hoverLabel.style.background = "rgba(0, 0, 0, 0.75)";
    hoverLabel.style.color = "#fff";
    hoverLabel.style.borderRadius = "4px";
    hoverLabel.style.fontSize = "0.85rem";
    hoverLabel.style.whiteSpace = "nowrap";
    hoverLabel.style.display = "none";
    hoverLabel.style.zIndex = "10";
    globeCard?.appendChild(hoverLabel);
}

export function updateCountryInfo(country) {
    const infoPanel = document.getElementById("country-info");
    if (!country) {
        infoPanel?.classList.add("d-none");
        return;
    }

    const data = country.properties;
    document.getElementById("country-name").textContent = data.admin || "";
    document.getElementById("continent").textContent = data.continent || "";
    document.getElementById("region_un").textContent = data.region_un || "";
    document.getElementById("subregion").textContent = data.subregion || "";
    document.getElementById("pop_est").textContent = formatNumber(data.pop_est);
    document.getElementById("area").textContent = formatNumber(data.area);

    const flag = document.getElementById("country-flag");
    if (flag) {
        flag.src = countryFlagUrl(country);
        flag.alt = `${data.admin || "Country"} flag`;
    }

    infoPanel?.classList.remove("d-none");
}

export function showHoverLabel(text, x, y) {
    if (!hoverLabel) return;
    hoverLabel.textContent = text;
    hoverLabel.style.display = "block";
    hoverLabel.style.left = `${x + 14}px`;
    hoverLabel.style.top = `${y + 14}px`;
}

export function hideHoverLabel() {
    if (!hoverLabel) return;
    hoverLabel.style.display = "none";
}
