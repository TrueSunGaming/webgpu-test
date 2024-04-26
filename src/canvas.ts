import { checkGPU } from "./checkGPU";

export const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
export const ctx: GPUCanvasContext = canvas.getContext("webgpu")!;

checkGPU();

export const adapter: GPUAdapter | null = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("No GPUAdapter found.");

export const device: GPUDevice = await adapter.requestDevice();
export const canvasFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();

ctx.configure({
    device,
    format: canvasFormat,
});

export const encoder: GPUCommandEncoder = device.createCommandEncoder();

export function render(pass: GPURenderPassEncoder): void {
    pass.end();
    device.queue.submit([encoder.finish()]);
}