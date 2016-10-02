namespace Examples {

    export class _96_Tiles {
        context: Cross.Eye.Context;
        shader: Cross.Eye.ShaderProgram;
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

            let stats = this.stats = new Stats();
            stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild( stats.dom );

        }
        
        public run() {
            this.handleDom();

            Cross.Loader.Assets.baseUrl = "assets/Tiles/"

            Cross.Loader.Assets.registerLoader("glsl", Cross.Loader.TextLoader);
            Cross.Loader.Assets.registerLoader("json", Cross.Loader.TiledLoader);
            Cross.Loader.Assets.registerLoader("png", Cross.Loader.ImageLoader);

            Cross.Loader.Assets.load([
                "fragment.glsl",
                "vertex.glsl",
                "lpc.json"
            ], (assets) => {

                

                let canvas = <HTMLCanvasElement>document.getElementById("canvas");
                let context = this.context = new Cross.Eye.Context(canvas, { alpha: false });
                
                context.enableAlphaBlending();

                let tiled_map = <Tiled.Map>assets["lpc.json"];
                
                let map = Cross.Eye.TileMap.fromTiled(tiled_map);

                let position = new Cross.Eye.Attribute("position", 2, Cross.Eye.DataType.UnsignedShort, false, false);
                let uv = new Cross.Eye.Attribute("uv", 2, Cross.Eye.DataType.UnsignedShort, true, true);
                //let uv = new Cross.Eye.Attribute("uv", 2);
                let attribConf = new Cross.Eye.AttributeConfiguration(position, uv);                               

                let texture = new Cross.Eye.ImageTexture(context, map.tileSet.image, false);
                //texture.filter = Cross.Eye.TextureFilterMode.Nearest;
                
                let vertexShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Vertex, assets["vertex.glsl"]);
                let fragmentShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Fragment, assets["fragment.glsl"]);
                let shader = this.shader = new Cross.Eye.ShaderProgram(context, vertexShader, fragmentShader);
                
                
                let cam = new Cross.Eye.OrthograficCamera(500, 500);
                //let matOrtho = mat4.ortho(mat4.create(), 0, 500, 500, 0, -10, 10);

                map.layers.forEach((layer,i)=>{
                    let positions = layer.createQuads(map.tileSet);
                    let store = new Cross.Eye.VertexStore(positions.length / position.components, attribConf);
                    //console.log();
                    store.setAttributes(position, positions);
                    store.setAttributes(uv, layer.createUVs(map.tileSet, true));
                    
                    let vbo = new Cross.Eye.VertexBuffer(context, store.buffer);
                    let ibo = new Cross.Eye.IndexBuffer(context, store.createQuadIndex());

                    this.drawCalls.push(() => {
                        vbo.bind();
                        shader.sendAttributes(attribConf);
                        context.draw(Cross.Eye.PrimitiveType.Triangles, 0, ibo.count, ibo);
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
}

