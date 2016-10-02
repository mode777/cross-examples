namespace Examples {

    export class _97_GradientMapping {
        context: Cross.Eye.Context;
        shader: Cross.Eye.ShaderProgram;
        grad = 0;
        offset = 0;

        constructor() {
            this.run();
        }

        public handleDom(){
        
        }

        
        public run() {
            this.handleDom();

            Cross.Loader.Assets.baseUrl = "assets/GradientMapping/"

            Cross.Loader.Assets.registerLoader("glsl", Cross.Loader.TextLoader);
            Cross.Loader.Assets.registerLoader("png", Cross.Loader.ImageLoader);

            Cross.Loader.Assets.load([
                "fragment.glsl",
                "vertex.glsl",
                'gradients.png',
                'sphere.png'
            ], (assets) => {

                let canvas = <HTMLCanvasElement>document.getElementById("canvas");
                let context = this.context = new Cross.Eye.Context(canvas, { alpha: false });

                let position = new Cross.Eye.Attribute("position", 2);
                let uv = new Cross.Eye.Attribute("uv", 2, Cross.Eye.DataType.UnsignedShort, true, true);
                
                let attribConf = new Cross.Eye.AttributeConfiguration(position, uv);
                
                let store = new Cross.Eye.VertexStore(4, attribConf);
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
                
                let vbo = new Cross.Eye.VertexBuffer(context, store.dataView.buffer);

                let texture0 = new Cross.Eye.ImageTexture(context, assets["sphere.png"]); 
                let texture1 = new Cross.Eye.ImageTexture(context, assets["gradients.png"]); 
                texture1.filter = Cross.Eye.TextureFilterMode.Nearest;

                let vertexShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Vertex, assets["vertex.glsl"]);
                let fragmentShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Fragment, assets["fragment.glsl"]);
                let shader = this.shader = new Cross.Eye.ShaderProgram(context, vertexShader, fragmentShader);
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
                    context.draw(Cross.Eye.PrimitiveType.TriangleStrip, 0, store.vertexCount );
                    
                    requestAnimationFrame(draw);
                }

                requestAnimationFrame(draw);

                setInterval(()=>{
                    this.grad++;
                }, 1000);
            });

        }
    }
}

