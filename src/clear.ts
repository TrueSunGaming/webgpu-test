import { ctx, encoder } from "./canvas";

export function clear(color: GPUColor = { r: 0, b: 0, g: 0, a: 1 }): GPURenderPassEncoder {
    return encoder.beginRenderPass({
        colorAttachments: [{
            view: ctx.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store",
            clearValue: color
        }]
    })
}