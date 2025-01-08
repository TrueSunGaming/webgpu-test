import { canvas, canvasFormat, device, render } from "./canvas";
import rectShader from "./rect.wgsl?raw";
import { createBindGroup, createUniformBuffer } from "./uniform";

export function renderRect(pass: GPURenderPassEncoder, x: number, y: number, width: number, height: number, fill: [number, number, number, number]): void {
    const scaledWidth: number = width / canvas.clientWidth;
    const scaledHeight: number = height / canvas.clientHeight;
    const scaledX: number = x / canvas.clientWidth;
    const scaledY: number = y / canvas.clientHeight;

    const vertices: Float32Array = new Float32Array([
        -scaledWidth + scaledX, -scaledHeight + scaledY,
        scaledWidth + scaledX, -scaledHeight + scaledY,
        scaledWidth + scaledX,  scaledHeight + scaledY,
        
        -scaledWidth + scaledX, -scaledHeight + scaledY,
        scaledWidth + scaledX,  scaledHeight + scaledY,
        -scaledWidth + scaledX,  scaledHeight + scaledY,
    ]);

    const vertexBuffer: GPUBuffer = device.createBuffer({
        label: "Rect vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const vertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0
        }],
    };

    const rectShaderModule: GPUShaderModule = device.createShaderModule({
        label: "Rect shader",
        code: rectShader
    });

    const pipeline: GPURenderPipeline = device.createRenderPipeline({
        label: "Rect pipeline",
        layout: "auto",
        vertex: {
            module: rectShaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: rectShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
                format: canvasFormat
            }]
        }
    });

    const uniformBuffer: GPUBuffer = createUniformBuffer(
        "Rect uniform buffer",
        new Float32Array(fill),
        0
    );

    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);

    pass.setBindGroup(0, createBindGroup(
        0,
        "Rect bind group",
        pipeline,
        [{
            binding: 0,
            resource: { buffer: uniformBuffer }
        }]
    ));

    pass.draw(vertices.length / 2);
}