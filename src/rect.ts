import { canvas, canvasFormat, device, render } from "./canvas";
import rectShader from "./rect.wgsl?raw";

export function renderRect(pass: GPURenderPassEncoder, x: number, y: number, width: number, height: number, fill: GPUColor): void {
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

    const cellShaderModule: GPUShaderModule = device.createShaderModule({
        label: "Rect shader",
        code: rectShader
    });

    const cellPipeline: GPURenderPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: "auto",
        vertex: {
            module: cellShaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: cellShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
                format: canvasFormat
            }]
        }
    });

    pass.setPipeline(cellPipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(vertices.length / 2);
}