import {
    Context,
    Shader,
    ShaderProgram,
    Attribute,
    AttributeConfiguration,
    VertexStore,
    ShaderType,
    VertexBuffer,
    PrimitiveType
} from "../../cross/src/Eye";

import {
    Assets,
    TextLoader
} from "../../cross/src/Load";

export class _01_BasicQuad {
    context: Context;
    shader: ShaderProgram;
    
    constructor() {
        this.run();
    }
    
    public run() {

        Assets.baseUrl = "assets/BasicQuad/"

        Assets.registerLoader("glsl", TextLoader);

        Assets.load([
            "fragment.glsl",
            "vertex.glsl",
        ], (assets) => {

            let canvas = <HTMLCanvasElement>document.getElementById("canvas");
            let context = this.context = new Context(canvas);

            let position = new Attribute("position", 2);
            let attribConf = new AttributeConfiguration(position);
            
            let store = new VertexStore(4, attribConf);
            store.setAttributes(position, [
                0.9, 0.9,
                -0.9, 0.9, 
                0.9, -0.9,
                -0.9, -0.9
            ]);    
            let vbo = new VertexBuffer(context, store.buffer);

            let vertexShader = new Shader(context, ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Shader(context, ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new ShaderProgram(context, vertexShader, fragmentShader);
            shader.use();
            
            //draw
            vbo.bind();
            shader.sendAttributes(attribConf);

            context.clear();
            context.draw(PrimitiveType.TriangleStrip, 0, 4);

        });

    }
}


