import * as THREE from 'three';


//Colors

const taliesenRed = new THREE.Color(0xC89640);  

const oscillatorOneColor = new THREE.Color(0xff8800); 

const tunnelColor = new THREE.Color(0x008285);

const neutraColorPalette = {
    neutraBeige: "#D9D4C5",
    sageGreen: "#A8B79A",
    warmGray: "#A9A39B",
    terracotta: "#C67650",
    paleSkyBlue: "#9EB8C2",
    oliveBrown: "#5A5A44",
    sunlitSand: "#E5C69F",
    mutedTeal: "#6E8D90",
    charcoalGray: "#4A4A4A"
};

const desaturatedTerracotta = new THREE.Color(neutraColorPalette.terracotta).lerp(new THREE.Color(0x808080), 0.001);
const desaturatedTunnel = new THREE.Color(tunnelColor).lerp(new THREE.Color(0x808080), 0.2);


export { taliesenRed,
        oscillatorOneColor,
        tunnelColor,
        neutraColorPalette,
        desaturatedTerracotta,
        desaturatedTunnel
 };