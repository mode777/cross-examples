import Stats = require('stats.js');
import * as Eye from "../cross/src/Eye";

export class Example {
    
    canvas: HTMLCanvasElement;
    element: Element;
    stats: Stats;
    gl: Eye.Context;
    
    constructor(id: string = "app"){
        this.element = document.getElementById(id);
        this.element.innerHTML = "";

        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = this.element.clientWidth;
        this.canvas.height = this.element.clientHeight;
        this.element.appendChild(this.canvas);

        this.gl = new Eye.Context(this.canvas);

        this.stats = new Stats();
        this.stats.showPanel( 0 );
        document.body.appendChild( this.stats.dom );

        
    }

    resize(){
        this.canvas.width = this.element.clientWidth;
        this.canvas.height = this.element.clientHeight;
        this.gl.viewport = {
            x: 0,
            y: 0,
            width: this.element.clientWidth,
            height: this.element.clientHeight
        }
    }    

    draw(){

    }

    load(finished: () => void) {

    } 

    createDom() {

    }

    init(){
        window.onresize = () => { this.resize(); }      

        let draw = () => {
            

            this.stats.begin();
            this.draw();
            this.stats.end();
            requestAnimationFrame(draw);
        };

        this.createDom();
        this.load(() => {
            requestAnimationFrame(draw);
        });
    }


}