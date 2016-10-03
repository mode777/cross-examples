import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";

export class _97_GradientMapping {
    context: Eye.Context;
    shader: Eye.ShaderProgram;
    grad = 0;
    offset = 0;

    constructor() {
        this.run();
    }

    public handleDom(){
    
    }

    
    public run() {
        this.handleDom();

        Load.Assets.baseUrl = "assets/GradientMapping/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);
        Load.Assets.registerLoader("png", Load.ImageLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
            'gradients.png',
            'sphere.png'
        ], (assets) => {

            let canvas = <HTMLCanvasElement>document.getElementById("canvas");
            let context = this.context = new Eye.Context(canvas, { alpha: false });

            let position = new Eye.Attribute("position", 2);
            let uv = new Eye.Attribute("uv", 2, Eye.DataType.UnsignedShort, true, true);
            
            let attribConf = new Eye.AttributeConfiguration(position, uv);
            
            let store = new Eye.VertexStore(4, attribConf);
            store.setAttributes(position, [
                1, 1,
                -1, 1, 
                1, -1,
                -1, -1
            ]);
            store.setAttributes(uv, [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0, 
                1.0, 1.0,
            ]);         
            
            let vbo = new Eye.VertexBuffer(context, store.dataView.buffer);

            let texture0 = new Eye.ImageTexture(context, assets["sphere.png"]); 
            let texture1 = new Eye.ImageTexture(context, assets["gradients.png"]); 
            texture1.filter = Eye.TextureFilterMode.Nearest;

            let vertexShader = new Eye.Shader(context, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(context, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(context, vertexShader, fragmentShader);
            shader.use();
            
            //draw
            vbo.bind();
            shader.sendAttributes(attribConf);
            
            texture0.bind(0);
            shader.sendTexture("tex[0]", texture0);
            texture1.bind(1);
            shader.sendTexture("tex[1]", texture1);

            context.clear();

            let draw = () => {
                shader.sendFloat("grad", this.grad);
                //this.offset+=0.005;
                shader.sendFloat("offset", this.offset);
                context.clear();
                context.draw(Eye.PrimitiveType.TriangleStrip, 0, store.vertexCount );
                
                requestAnimationFrame(draw);
            }

            requestAnimationFrame(draw);

            setInterval(()=>{
                this.grad++;
            }, 1000);
        });

    }
}


