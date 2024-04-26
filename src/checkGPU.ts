export function checkGPU(): void {
    if (!navigator.gpu) {
        alert("WebGPU is not supported");
        throw new Error("WebGPU is not supported.");
    }
}