import {
    Context, 
    Attribute, 
    AttributeConfiguration, 
    VertexStore,
    Shader,
    ShaderProgram,
    PrimitiveType, 
    DataType, 
    VertexBuffer, 
    ImageTexture,
    ShaderType
} from "../../cross/src/Eye";
import {Assets, TextLoader, ImageLoader} from "../../cross/src/Load";

export class _03_TexturedQuad {
    context: Context;
    shader: ShaderProgram;
    
    constructor() {
        this.run();
    }
    
    public run() {

        Assets.baseUrl = "assets/TexturedQuad/"

        Assets.registerLoader("glsl", TextLoader);
        Assets.registerLoader("gif", ImageLoader);

        Assets.load([
            "fragment.glsl",
            "vertex.glsl",
            "stone1.gif"
        ], (assets) => {

            let canvas = <HTMLCanvasElement>document.getElementById("canvas");
            let context = this.context = new Context(canvas);

            let position = new Attribute("position", 2);
            let uv = new Attribute("uv", 2, DataType.UnsignedShort, true, true);
            let attribConf = new AttributeConfiguration(position, uv);
            
            let store = new VertexStore(4, attribConf);
            store.setAttributes(position, [
                0.9, 0.9,
                -0.9, 0.9, 
                0.9, -0.9,
                -0.9, -0.9
            ]);
            store.setAttributes(uv, [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0, 
                1.0, 1.0,
            ]);         
            
            let vbo = new VertexBuffer(context, store.dataView.buffer);

            let texture = new ImageTexture(context, assets["stone1.gif"]); 

            let vertexShader = new Shader(context, ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Shader(context, ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new ShaderProgram(context, vertexShader, fragmentShader);
            shader.use();
            
            //draw
            vbo.bind();
            shader.sendAttributes(attribConf);
            
            texture.bind(0);
            shader.sendTexture("texture0", texture);

            context.clear();

            context.draw(PrimitiveType.TriangleStrip, 0, store.vertexCount);
        });

    }
}


