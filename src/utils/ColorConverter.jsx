export function hexToRgb(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
}

export function hexToBabylonColor3(hex) {
    const { r, g, b } = hexToRgb(hex);
    return new BABYLON.Color3(r / 255, g / 255, b / 255);
}