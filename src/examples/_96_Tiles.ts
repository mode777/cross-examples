/// <reference path="../../cross/definitions/Tiled.d.ts" />
import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {vec3} from "gl-matrix";
import Stats = require('stats.js');
import {Example} from "../Example";

export class _96_Tiles extends Example{
    shader: Eye.ShaderProgram;
    moveX = 0;
    moveY = 0;
    drawCalls: (() => void)[] = [];
    stats: Stats;
    cam: Eye.OrthograficCamera;
    x = 0;
    y = 0;

    constructor() {
        super();
        this.init();
    }

    createDom(){
        this.canvas.onmousemove = (ev) => {
            let rect = this.canvas.getBoundingClientRect();
            let x = ev.clientX - rect.left;
            let y = ev.clientY - rect.top;
            this.moveX = (-(rect.width/2 - x) / (rect.width /2))*2;
            this.moveY = (-(rect.height/2 - y) / (rect.height /2))*2;
        }
    }
    
    public load(finish: ()=>void) {

        Load.Assets.baseUrl = "assets/Tiles/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);
        Load.Assets.registerLoader("json", Load.TiledLoader);
        Load.Assets.registerLoader("png", Load.ImageLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
            "lpc.json"
        ], (assets) => {
            this.gl.enableAlphaBlending();

            let tiled_map = <Tiled.Map>assets["lpc.json"];
            
            let map = Eye.TileMap.fromTiled(tiled_map);

            let position = new Eye.Attribute("position", 2, Eye.DataType.UnsignedShort, false, false);
            let uv = new Eye.Attribute("uv", 2, Eye.DataType.UnsignedShort, true, true);
            //let uv = new Eye.Attribute("uv", 2);
            let attribConf = new Eye.AttributeConfiguration(position, uv);                               

            let texture = new Eye.ImageTexture(this.gl, map.tileSet.image, false);
            texture.filter = Eye.TextureFilterMode.Nearest;
            
            let vertexShader = new Eye.Shader(this.gl, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(this.gl, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(this.gl, vertexShader, fragmentShader);
            
            
            this.cam = new Eye.OrthograficCamera(this.element.clientWidth, this.element.clientHeight);
            //let matOrtho = mat4.ortho(mat4.create(), 0, 500, 500, 0, -10, 10);

            map.layers.forEach((layer,i)=>{
                let positions = layer.createQuads(map.tileSet);
                let store = new Eye.VertexStore(positions.length / position.components, attribConf);
                //console.log();
                store.setAttributes(position, positions);
                store.setAttributes(uv, layer.createUVs(map.tileSet, true));
                
                let vbo = new Eye.VertexBuffer(this.gl, store.buffer);
                let ibo = new Eye.IndexBuffer(this.gl, store.createQuadIndex());

                this.drawCalls.push(() => {
                    vbo.bind();
                    shader.sendAttributes(attribConf);
                    this.gl.draw(Eye.PrimitiveType.Triangles, 0, ibo.count, ibo);
                });

                console.log(store.vertexCount);
            });

            
            shader.use();
            shader.sendTexture("texture", texture);
            //shader.sendVector2("size", vec2.fromValues(map.tileSet.image.width, map.tileSet.image.height));

            let x = 0, y = 0, speed = 0.3;

            shader.sendMatrix4("projection", this.cam.projectionMatrix);
            let draw = () => {
                this.cam.position = vec3.fromValues(x-=this.moveX, y-=this.moveY, 0);
                shader.sendMatrix4("view", this.cam.viewMatrix);
                this.gl.clear();
                this.drawCalls.forEach((func) => func());
            }
            finish();
        });

    }

    draw(){
        this.cam.position = vec3.fromValues(this.x-=this.moveX, this.y-=this.moveY, 0);
        this.shader.sendMatrix4("view", this.cam.viewMatrix);
        this.gl.clear();
        this.drawCalls.forEach((func) => func());
    }

    resize() {
        super.resize();
        this.cam = new Eye.OrthograficCamera(this.element.clientWidth, this.element.clientHeight);
        console.log(this.element.clientWidth, this.element.clientHeight);
        this.shader.sendMatrix4("projection", this.cam.projectionMatrix);
    }
}


