import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";

export class _02_ColorQuad {
    context: Eye.Context;
    shader: Eye.ShaderProgram;
    
    constructor() {
        this.run();
    }
    
    public run() {
        Load.Assets.baseUrl = "assets/ColorQuad/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
        ], (assets) => {

            let canvas = <HTMLCanvasElement>document.getElementById("canvas");
            let context = this.context = new Eye.Context(canvas);

            let position = new Eye.Attribute("position", 2);
            let color = new Eye.Attribute("color", 4, Eye.DataType.UnsignedByte, true, false);
            let attribConf = new Eye.AttributeConfiguration(position, color);
            
            let store = new Eye.VertexStore(4, attribConf);
            store.setAttributes(position, [
                0.9, 0.9,
                -0.9, 0.9, 
                0.9, -0.9,
                -0.9, -0.9
            ]);                
            store.setAttributes(color, [
                255, 0, 0, 255,
                0, 255, 0, 255,
                0, 0, 255, 255,
                255,255,0, 255
            ]);       

            let vbo = new Eye.VertexBuffer(context, store.dataView.buffer);

            let vertexShader = new Eye.Shader(context, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(context, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(context, vertexShader, fragmentShader);
            shader.use();
            
            //draw
            vbo.bind();
            shader.sendAttributes(attribConf);
            
            context.clear();

            context.draw(Eye.PrimitiveType.TriangleStrip, 0, store.vertexCount);

        });

    }
}


