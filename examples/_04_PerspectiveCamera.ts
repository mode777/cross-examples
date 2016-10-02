namespace Examples {

    export class _04_PerspectiveCamera {
        context: Cross.Eye.Context;
        shader: Cross.Eye.ShaderProgram;
        
        constructor() {
            this.run();
        }
        
        public run() {

            Cross.Loader.Assets.baseUrl = "assets/PerspectiveCamera/"

            Cross.Loader.Assets.registerLoader("glsl", Cross.Loader.TextLoader);
            Cross.Loader.Assets.registerLoader("gif", Cross.Loader.ImageLoader);

            Cross.Loader.Assets.load([
                "fragment.glsl",
                "vertex.glsl",
                "stone1.gif"
            ], (assets) => {

                let canvas = <HTMLCanvasElement>document.getElementById("canvas");
                let context = this.context = new Cross.Eye.Context(canvas);

                let position = new Cross.Eye.Attribute("position", 2);
                let uv = new Cross.Eye.Attribute("uv", 2, Cross.Eye.DataType.UnsignedShort, true, true);
                let attribConf = new Cross.Eye.AttributeConfiguration(position, uv);
                
                let store = new Cross.Eye.VertexStore(4, attribConf);
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
                
                let vbo = new Cross.Eye.VertexBuffer(context, store.dataView.buffer);

                let texture = new Cross.Eye.ImageTexture(context, assets["stone1.gif"]); 

                let vertexShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Vertex, assets["vertex.glsl"]);
                let fragmentShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Fragment, assets["fragment.glsl"]);
                let shader = this.shader = new Cross.Eye.ShaderProgram(context, vertexShader, fragmentShader);

                let camera = new Cross.Eye.PerspectiveCamera();
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
                context.draw(Cross.Eye.PrimitiveType.TriangleStrip, 0, store.vertexCount);

            });

        }
    }
}
