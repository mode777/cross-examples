import * as Examples from "./src/examples";

window.onload = () => {
    let select = <HTMLSelectElement>document.getElementById("select");
    let examples = <any>Examples;
    let app: any;
    
    for(let name in Examples){
        let screenName = name.replace(/_/g, " ");
        let option = new Option(screenName, name);
        select.appendChild(option);
    }

    select.onchange = (ev) => {
        window.location.hash = select.value;
        app = new examples[select.value]()
    }

    if(window.location.hash.length > 0){
        let name = window.location.hash.substr(1);
        select.value = name;
        app = new examples[name]();
    }

    
}