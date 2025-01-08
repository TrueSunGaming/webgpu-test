import { device } from "./canvas";

export function createUniformBuffer(label: string, data: BufferSource | SharedArrayBuffer, offset: GPUSize64 = 0): GPUBuffer {
    const buffer = device.createBuffer({
        label,
        size: data.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(buffer, offset, data);

    return buffer;
}

export function createBindGroup(group: number, label: string, pipeline: GPURenderPipeline, entries: GPUBindGroupEntry[]): GPUBindGroup {
    return device.createBindGroup({
        label,
        layout: pipeline.getBindGroupLayout(group),
        entries
    });
}