namespace Examples {

    export class _98_TexturedBlending {
        context: Cross.Eye.Context;
        shader: Cross.Eye.ShaderProgram;
        mixer: HTMLInputElement;
        lowerRange: HTMLInputElement;
        upperRange: HTMLInputElement;

        
        constructor() {
            this.run();
        }

        public handleDom(){
            let container = <HTMLDivElement>document.createElement("div");

            let mixer = this.mixer = <HTMLInputElement>document.createElement("input");            
            mixer.type = "range";

            let lowerRange = this.lowerRange = <HTMLInputElement>document.createElement("input"); 
            lowerRange.type = "range";
            lowerRange.value = "0";

            let upperRange = this.upperRange = <HTMLInputElement>document.createElement("input"); 
            upperRange.type = "range";
            upperRange.value = "100";

            container.style.position = "fixed";
            container.style.left = "600px";
            container.style.top = "100px";
            container.style.width = "200px";

            container.appendChild(mixer);
            container.appendChild(lowerRange);
            container.appendChild(upperRange);

            document.body.appendChild(container);
        }

        rangeVal(element: HTMLInputElement): number{
            return parseInt(element.value) / 100;
        }
        
        public run() {
            this.handleDom();

            Cross.Loader.Assets.baseUrl = "assets/TextureBlending/"

            Cross.Loader.Assets.registerLoader("glsl", Cross.Loader.TextLoader);
            Cross.Loader.Assets.registerLoader("gif", Cross.Loader.ImageLoader);
            Cross.Loader.Assets.registerLoader("png", Cross.Loader.ImageLoader);
            Cross.Loader.Assets.registerLoader("tga", Cross.Loader.ImageLoader);

            Cross.Loader.Assets.load([
                "fragment.glsl",
                "vertex.glsl",
                "desert.png",
                "grass.png",
                "ground.png",
                "stone.png",
            ], (assets) => {

                let canvas = <HTMLCanvasElement>document.getElementById("canvas");
                let context = this.context = new Cross.Eye.Context(canvas, { alpha: false });

                let position = new Cross.Eye.Attribute("position", 2);
                let uv = new Cross.Eye.Attribute("uv", 2, Cross.Eye.DataType.UnsignedShort, true, true);
                let blend = new Cross.Eye.Attribute("blend", 4, Cross.Eye.DataType.UnsignedByte, true, true);
                
                let attribConf = new Cross.Eye.AttributeConfiguration(position, uv, blend);
                
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
                store.setAttributes(blend, [
                    0.0, 0.0, 0.0, 0.0, 
                    1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 0.0, 0.0
                ]);
                
                let vbo = new Cross.Eye.VertexBuffer(context, store.dataView.buffer);

                let texture0 = new Cross.Eye.ImageTexture(context, assets["desert.png"]); 
                let texture1 = new Cross.Eye.ImageTexture(context, assets["ground.png"]); 
                let texture2 = new Cross.Eye.ImageTexture(context, assets["grass.png"]); 

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
                texture2.bind(2);
                shader.sendTexture("tex[2]", texture2);

                context.clear();

                let draw = () => {
                    //console.log(this.mixer.value);
                    //let val = parseInt(this.mixer.value) / 100;
                    shader.sendFloat("mixer", this.rangeVal(this.mixer));
                    shader.sendFloat("lowerRange", this.rangeVal(this.lowerRange));
                    shader.sendFloat("upperRange", this.rangeVal(this.upperRange));

                    context.clear();
                    context.draw(Cross.Eye.PrimitiveType.TriangleStrip, 0, store.vertexCount );

                    requestAnimationFrame(draw);
                }

                requestAnimationFrame(draw);

            });

        }
    }
}

