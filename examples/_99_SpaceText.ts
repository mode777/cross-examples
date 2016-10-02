namespace Examples {

    export class _99_SpaceText {
        context: Cross.Eye.Context;
        shader: Cross.Eye.ShaderProgram;
        
        constructor() {
            this.run();
        }
        
        public run() {

            Cross.Loader.Assets.baseUrl = "assets/SpaceText/"
            Cross.Loader.Assets.registerLoader("glsl", Cross.Loader.TextLoader);

            Cross.Loader.Assets.load([
                new Cross.Loader.XmlSpriteFontLoader("franklin_gothic_medium_regular_24.xml", "franklin_gothic_medium_regular_24.png"),
                "fragment.glsl",
                "vertex.glsl",
            ], (assets) => {

                let textContent = `It is a dark time for the Rebellion. Although the Death Star has been destroyed, Imperial troops have driven the Rebel forces from their hidden base and pursued them across the galaxy.\n\nEvading the dreaded Imperial Starfleet, a group of freedom fighters led by Luke Skywalker has established a new secret base on the remote ice world of Hoth.\n\nThe evil lord Darth Vader, obsessed with finding young Skywalker, has dispatched thousands of remote probes into the far reaches of space…`

                let canvas = <HTMLCanvasElement>document.getElementById("canvas");

                let context = this.context = new Cross.Eye.Context(canvas, { alpha: false });
                context.enableAlphaBlending();

                let position = new Cross.Eye.Attribute("position", 3);
                let uv = new Cross.Eye.Attribute("uv", 2, Cross.Eye.DataType.UnsignedShort, true, true);
                let attribConf = new Cross.Eye.AttributeConfiguration(position, uv);
                
                let font = <Cross.Eye.SpriteFont>assets["franklin_gothic_medium_regular_24.xml"];
                let text = new Cross.Eye.SpriteText(textContent, font, 500);
                let texture = new Cross.Eye.ImageTexture(context, font.image);

                let store = text.generateGeometry(position, uv);  

                let vbo = new Cross.Eye.VertexBuffer(context, store.buffer);
                let ibo = new Cross.Eye.IndexBuffer(context, store.createQuadIndex());
                let vertexShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Vertex, assets["vertex.glsl"]);
                let fragmentShader = new Cross.Eye.Shader(context, Cross.Eye.ShaderType.Fragment, assets["fragment.glsl"]);
                let shader = this.shader = new Cross.Eye.ShaderProgram(context, vertexShader, fragmentShader);
                
                let matOrtho = mat4.ortho(mat4.create(), 500, 0, 0, 500, -10, 10);
                let camera = new Cross.Eye.PerspectiveCamera();
                camera.target = vec3.fromValues(0,-3,0);
                camera.position = vec3.fromValues(0,0.5,1.5);                              

                //draw
                shader.use();
                vbo.bind();
                texture.bind(0);
                
                shader.sendAttributes(attribConf);
                shader.sendTexture("texture0", texture);
                shader.sendMatrix4("ortho", matOrtho);
                shader.sendMatrix4("projection", camera.projectionMatrix);
                shader.sendVector3("color", vec3.fromValues(229/255, 177/255, 58/255));

                let draw = () => {
                    camera.position = vec3.add(camera.position, camera.position, vec3.fromValues(0, 0.001, 0));
                    camera.target = vec3.add(camera.target, camera.target, vec3.fromValues(0, 0.001, 0));
                    shader.sendMatrix4("view", camera.viewMatrix);

                    context.clear();
                    context.draw(Cross.Eye.PrimitiveType.Triangles, 0, ibo.count, ibo);

                    requestAnimationFrame(draw);
                }

                requestAnimationFrame(draw);

            });

        }
    }
}

