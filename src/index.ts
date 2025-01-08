import { render } from "./canvas";
import { clear } from "./clear";
import { renderRect } from "./rect";

const pass: GPURenderPassEncoder = clear();

renderRect(pass, 0, 0, 100, 100, [1, 1, 0, 1]);

render(pass);