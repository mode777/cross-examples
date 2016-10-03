import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {Example} from "../Example";

export class _02_ColorQuad extends Example {
    shader: Eye.ShaderProgram;
    vbo: Eye.VertexBuffer;
    store: Eye.VertexStore;
    attrConf: Eye.AttributeConfiguration;
    
    constructor() {
        super();
        this.init();
    }
    
   load(finish: ()=>void) {
        Load.Assets.baseUrl = "assets/ColorQuad/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
        ], (assets) => {
            let position = new Eye.Attribute("position", 2);
            let color = new Eye.Attribute("color", 4, Eye.DataType.UnsignedByte, true, false);
            let attribConf = this.attrConf = new Eye.AttributeConfiguration(position, color);
            
            let store = this.store = new Eye.VertexStore(4, attribConf);
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

            let vbo = this.vbo = new Eye.VertexBuffer(this.gl, store.dataView.buffer);

            let vertexShader = new Eye.Shader(this.gl, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(this.gl, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(this.gl, vertexShader, fragmentShader);
            shader.use();
            
            finish();
        });
    }

    draw(){
        this.vbo.bind();
        this.shader.sendAttributes(this.attrConf);
        
        this.gl.clear();

        this.gl.draw(Eye.PrimitiveType.TriangleStrip, 0, this.store.vertexCount);
    }
}


