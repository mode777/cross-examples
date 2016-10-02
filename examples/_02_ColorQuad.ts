namespace Examples {

    export class _02_ColorQuad {
        context: Cross.Eye.Context;
        shader: Cross.Eye.ShaderProgram;
        
        constructor() {
            this.run();
        }
        
        public run() {
            Cross.Loader.Assets.baseUrl = "assets/ColorQuad/"

            Cross.Loader.Assets.registerLoader("glsl", Cross.Loader.TextLoader);

            Cross.Loader.Assets.load([
                "fragment.glsl",
                "vertex.glsl",
            ], (assets) => {

                let canvas = <HTMLCanvasElement>document.getElementById("canvas");
                let context = this.context = new Cross.Eye.Context(canvas);

                let position = new Cross.Eye.Attribute("position", 2);
                let color = new Cross.Eye.Attribute("color", 4, Cross.Eye.DataType.UnsignedByte, true, false);
                let attribConf = new Cross.Eye.AttributeConfiguration(position, color);
                
                let store = new Cross.Eye.VertexStore(4, attribConf);
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

                let vbo = new Cross.Eye.VertexBuffer(context, store.dataView.buffer);

                let vertexShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Vertex, assets["vertex.glsl"]);
                let fragmentShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Fragment, assets["fragment.glsl"]);
                let shader = this.shader = new Cross.Eye.ShaderProgram(context, vertexShader, fragmentShader);
                shader.use();
                
                //draw
                vbo.bind();
                shader.sendAttributes(attribConf);
                
                context.clear();

                context.draw(Cross.Eye.PrimitiveType.TriangleStrip, 0, store.vertexCount);

            });

        }
    }
}

