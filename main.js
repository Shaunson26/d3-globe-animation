import { initGlobe } from "./globe.js";
import * as data from "./data.js";
import { initUI } from "./ui.js";
import { setupInteractions } from "./interactions.js";

const globe = initGlobe("#globe-canvas");
initUI();
setupInteractions(globe, data);
