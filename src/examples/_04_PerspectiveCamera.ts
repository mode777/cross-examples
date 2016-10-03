import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {vec3} from "gl-matrix";

export class _04_PerspectiveCamera {
    context: Eye.Context;
    shader: Eye.ShaderProgram;
    
    constructor() {
        this.run();
    }
    
    public run() {

        Load.Assets.baseUrl = "assets/PerspectiveCamera/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);
        Load.Assets.registerLoader("gif", Load.ImageLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
            "stone1.gif"
        ], (assets) => {

            let canvas = <HTMLCanvasElement>document.getElementById("canvas");
            let context = this.context = new Eye.Context(canvas);

            let position = new Eye.Attribute("position", 2);
            let uv = new Eye.Attribute("uv", 2, Eye.DataType.UnsignedShort, true, true);
            let attribConf = new Eye.AttributeConfiguration(position, uv);
            
            let store = new Eye.VertexStore(4, attribConf);
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
            
            let vbo = new Eye.VertexBuffer(context, store.dataView.buffer);

            let texture = new Eye.ImageTexture(context, assets["stone1.gif"]); 

            let vertexShader = new Eye.Shader(context, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(context, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(context, vertexShader, fragmentShader);

            let camera = new Eye.PerspectiveCamera();
            camera.position = vec3.fromValues(0,2,2);
            
            //draw
            shader.use();
            vbo.bind();
            texture.bind(0);
            
            shader.sendAttributes(attribConf);
            shader.sendTexture("texture0", texture);
            shader.sendMatrix4("view", camera.viewMatrix);
            shader.sendMatrix4("projection", camera.projectionMatrix);

            context.clear();
            context.draw(Eye.PrimitiveType.TriangleStrip, 0, store.vertexCount);

        });

    }
}


