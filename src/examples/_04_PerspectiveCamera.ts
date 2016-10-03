import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {vec3} from "gl-matrix";
import {Example} from "../Example";

export class _04_PerspectiveCamera extends Example {
    shader: Eye.ShaderProgram;
    attribConf: Eye.AttributeConfiguration;
    vbo: Eye.VertexBuffer;
    texture: Eye.Texture;
    store: Eye.VertexStore;
    camera: Eye.PerspectiveCamera;
    z = 0;

    constructor() {
        super();
        this.init();
    }
    
    public load(finish: ()=>void) {

        Load.Assets.baseUrl = "assets/PerspectiveCamera/"

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

            let camera = this.camera = new Eye.PerspectiveCamera();

            finish();
        });

    }

    draw(){
        this.shader.use();
        this.vbo.bind();
        this.texture.bind(0);
        
        this.shader.sendAttributes(this.attribConf);
        this.shader.sendTexture("texture0", this.texture);
        
        this.camera.position = vec3.fromValues(0,2,this.z+=.01);
        this.shader.sendMatrix4("view", this.camera.viewMatrix);
        this.shader.sendMatrix4("projection", this.camera.projectionMatrix);

        this.gl.clear();
        this.gl.draw(Eye.PrimitiveType.TriangleStrip, 0, this.store.vertexCount);
    }

}


