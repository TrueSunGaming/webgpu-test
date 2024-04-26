import { render } from "./canvas";
import { clear } from "./clear";
import { renderRect } from "./rect";

const pass: GPURenderPassEncoder = clear();

//renderRect(pass, 0, 0, 100, 100, { r: 1, g: 1, b: 0, a: 1 });

render(pass);