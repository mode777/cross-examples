import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {vec3, mat4} from "gl-matrix";
import {Example} from "../Example";

export class _05_RotatingCube extends Example {
    shader: Eye.ShaderProgram;
    attribConf: Eye.AttributeConfiguration;
    vbo: Eye.VertexBuffer;
    ibo: Eye.IndexBuffer;
    store: Eye.VertexStore;
    camera: Eye.PerspectiveCamera;
    transform: Eye.Transform3d;
    z = 0;

    constructor() {
        super();
        this.init();
    }
    
    public load(finish: ()=>void) {

        Load.Assets.baseUrl = "assets/RotatingCube/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);
        Load.Assets.registerLoader("gif", Load.ImageLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
        ], (assets) => {

            //this.gl.cullingMode = Eye.CullingMode.Back;

            let position = new Eye.Attribute("position", 3);
            //let uv = new Eye.Attribute("uv", 2, Eye.DataType.UnsignedShort, true, true);
            let attribConf = this.attribConf = new Eye.AttributeConfiguration(position);
            
            let store = this.store = new Eye.VertexStore(8, attribConf);
            store.setAttributes(position, [
                -0.5,   -0.5,   -0.5,
                0.5,    -0.5,   -0.5,
                0.5,    0.5,    -0.5,
                -0.5,   0.5,    -0.5,

                0.5,    0.5,    0.5,
                -0.5,   0.5,    0.5,  
                -0.5,   -0.5,   0.5,
                0.5,    -0.5,   0.5,
            ]);     
            
            let vbo = this.vbo = new Eye.VertexBuffer(this.gl, store.dataView.buffer);
            let ibo = this.ibo = new Eye.IndexBuffer(this.gl, store.createQuadIndex());

            let vertexShader = new Eye.Shader(this.gl, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(this.gl, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(this.gl, vertexShader, fragmentShader);

            let camera = this.camera = new Eye.PerspectiveCamera(null, null, null, this.gl.viewport.width / this.gl.viewport.height);
            this.transform = new Eye.Transform3d();

            finish();
        });

    }

    draw(){
        this.shader.use();
        this.vbo.bind();
        
        this.transform.rotation = vec3.fromValues(this.z+=0.005,this.z+=0.005,this.z+=0.005);

        
        this.shader.sendAttributes(this.attribConf);
        
        this.shader.sendMatrix4("model", this.transform.matrix);
        this.shader.sendMatrix4("view", this.camera.viewMatrix);
        this.shader.sendMatrix4("projection", this.camera.projectionMatrix);

        this.gl.clear();
        this.gl.draw(Eye.PrimitiveType.Triangles, 0, this.ibo.count, this.ibo);
    }

    resize(){
        super.resize()
        this.camera = new Eye.PerspectiveCamera(null, null, null, this.gl.viewport.width / this.gl.viewport.height);
    }

}


