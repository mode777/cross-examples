/// <reference path="../../cross/definitions/Tiled.d.ts" />
import * as Eye from "../../cross/src/Eye";
import * as Load from "../../cross/src/Load";
import {vec3} from "gl-matrix";
import Stats = require('stats.js');

export class _96_Tiles {
    context: Eye.Context;
    shader: Eye.ShaderProgram;
    moveX = 0;
    moveY = 0;
    drawCalls: (() => void)[] = [];
    stats: Stats;

    constructor() {
        this.run();
    }

    public handleDom(){
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        canvas.onmousemove = (ev) => {
            let rect = canvas.getBoundingClientRect();
            let x = ev.clientX - rect.left;
            let y = ev.clientY - rect.top;
            this.moveX = (-(rect.width/2 - x) / (rect.width /2))*2;
            this.moveY = (-(rect.height/2 - y) / (rect.height /2))*2;
        }
        console.log(Stats);
        let stats = this.stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );

    }
    
    public run() {
        this.handleDom();

        Load.Assets.baseUrl = "assets/Tiles/"

        Load.Assets.registerLoader("glsl", Load.TextLoader);
        Load.Assets.registerLoader("json", Load.TiledLoader);
        Load.Assets.registerLoader("png", Load.ImageLoader);

        Load.Assets.load([
            "fragment.glsl",
            "vertex.glsl",
            "lpc.json"
        ], (assets) => {

            

            let canvas = <HTMLCanvasElement>document.getElementById("canvas");
            let context = this.context = new Eye.Context(canvas, { alpha: false });
            
            context.enableAlphaBlending();

            let tiled_map = <Tiled.Map>assets["lpc.json"];
            
            let map = Eye.TileMap.fromTiled(tiled_map);

            let position = new Eye.Attribute("position", 2, Eye.DataType.UnsignedShort, false, false);
            let uv = new Eye.Attribute("uv", 2, Eye.DataType.UnsignedShort, true, true);
            //let uv = new Eye.Attribute("uv", 2);
            let attribConf = new Eye.AttributeConfiguration(position, uv);                               

            let texture = new Eye.ImageTexture(context, map.tileSet.image, false);
            //texture.filter = Eye.TextureFilterMode.Nearest;
            
            let vertexShader = new Eye.Shader(context, Eye.ShaderType.Vertex, assets["vertex.glsl"]);
            let fragmentShader = new Eye.Shader(context, Eye.ShaderType.Fragment, assets["fragment.glsl"]);
            let shader = this.shader = new Eye.ShaderProgram(context, vertexShader, fragmentShader);
            
            
            let cam = new Eye.OrthograficCamera(500, 500);
            //let matOrtho = mat4.ortho(mat4.create(), 0, 500, 500, 0, -10, 10);

            map.layers.forEach((layer,i)=>{
                let positions = layer.createQuads(map.tileSet);
                let store = new Eye.VertexStore(positions.length / position.components, attribConf);
                //console.log();
                store.setAttributes(position, positions);
                store.setAttributes(uv, layer.createUVs(map.tileSet, true));
                
                let vbo = new Eye.VertexBuffer(context, store.buffer);
                let ibo = new Eye.IndexBuffer(context, store.createQuadIndex());

                this.drawCalls.push(() => {
                    vbo.bind();
                    shader.sendAttributes(attribConf);
                    context.draw(Eye.PrimitiveType.Triangles, 0, ibo.count, ibo);
                });

                console.log(store.vertexCount);
            });

            
            shader.use();
            shader.sendTexture("texture", texture);
            shader.sendMatrix4("projection", cam.projectionMatrix);
            //shader.sendVector2("size", vec2.fromValues(map.tileSet.image.width, map.tileSet.image.height));

            let x = 0, y = 0, speed = 0.3;

            let draw = () => {
                this.stats.begin();

                cam.position = vec3.fromValues(x-=this.moveX, y-=this.moveY, 0);
                shader.sendMatrix4("view", cam.viewMatrix);
                context.clear();
                this.drawCalls.forEach((func) => func());
                
                this.stats.end();
                
                requestAnimationFrame(draw);
            }

            requestAnimationFrame(draw);
        });

    }
}


