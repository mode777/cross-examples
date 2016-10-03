import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {Example} from "../Example";

export class _03_TexturedQuad extends Example {
    shader: Eye.ShaderProgram;
    attribConf: Eye.AttributeConfiguration;
    vbo: Eye.VertexBuffer;
    texture: Eye.Texture;
    store: Eye.VertexStore;
    
    constructor() {
        super();
        this.init();
    }
    
    public load(finish: ()=>void) {

        Load.Assets.baseUrl = "assets/TexturedQuad/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);
        Load.Assets.registerLoader("gif", Load.ImageLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
            "stone1.gif"
        ], (assets) => {
            let position = new Eye.Attribute("position", 2);
            let uv = new Eye.Attribute("uv", 2, Eye.DataType.UnsignedShort, true, true);
            let attribConf = this.attribConf = new Eye.AttributeConfiguration(position, uv);
            
            let store = this.store = new Eye.VertexStore(4, attribConf);
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
            
            let vbo = this.vbo = new Eye.VertexBuffer(this.gl, store.dataView.buffer);

            let texture = this.texture = new Eye.ImageTexture(this.gl, assets["stone1.gif"]); 

            let vertexShader = new Eye.Shader(this.gl, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(this.gl, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(this.gl, vertexShader, fragmentShader);
            shader.use();

            finish();
        });
    }

    draw(){
        this.vbo.bind();
        this.shader.sendAttributes(this.attribConf);
        
        this.texture.bind(0);
        this.shader.sendTexture("texture0", this.texture);

        this.gl.clear();

        this.gl.draw(Eye.PrimitiveType.TriangleStrip, 0, this.store.vertexCount);
    }
}


