import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {Example} from "../Example";

export class _01_BasicQuad extends Example  {
    shader: Eye.ShaderProgram;
    vbo: Eye.VertexBuffer;
    attributeConf: Eye.AttributeConfiguration;
    store: Eye.VertexStore;
    
    constructor() {
        super();
        this.init();
    }

    load(finish: () => void){
        Load.Assets.baseUrl = "assets/BasicQuad/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
        ], (assets) => {

            let position = new Eye.Attribute("position", 2);
            let attribConf = this.attributeConf = new Eye.AttributeConfiguration(position);
            
            let store = this.store = new Eye.VertexStore(4, attribConf);
            store.setAttributes(position, [
                0.9, 0.9,
                -0.9, 0.9, 
                0.9, -0.9,
                -0.9, -0.9
            ]);    
            let vbo = this.vbo = new Eye.VertexBuffer(this.gl, store.buffer);

            let vertexShader = new Eye.Shader(this.gl, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(this.gl, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(this.gl, vertexShader, fragmentShader);
            shader.use();

            finish();
        });
    }
    
    draw() {
        this.vbo.bind();
        this.shader.sendAttributes(this.attributeConf);
                    
        this.gl.clear();
        this.gl.draw(Eye.PrimitiveType.TriangleStrip, 0, this.store.vertexCount);      
    }

}


