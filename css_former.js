
function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}
let styleSheets = document.styleSheets;
let allRules = [];
for (let i = 0; i < styleSheets.length; i++) {
    let cssRules = styleSheets[i].cssRules || styleSheets[i].rules;
    allRules = allRules.concat(cssRules);
}
let allRules_0 = []
for (let css_rule of allRules[0]){
    if(css_rule.type == 1){
        let neighbor_elems = css_rule.selectorText.split(", ");
        let ccs_array = [];
        for (let k = 0; k < neighbor_elems.length; k++) {
            ccs_array.push([]);
            neighbor_elems[k] = neighbor_elems[k].replace(/\S+\s\+\s/gm, "");
            neighbor_elems[k] = neighbor_elems[k].replace(/:not\(\S+\)/gm, "");
            neighbor_elems[k] = neighbor_elems[k].split(" > ");
            for (let i = 0; i < neighbor_elems[k].length; i++) {
                neighbor_elems[k][i] = neighbor_elems[k][i].split(" ");
                for (let j = 0; j < neighbor_elems[k][i].length; j++) {
                    neighbor_elems[k][i][j] = neighbor_elems[k][i][j].split(".");
                    let classes = neighbor_elems[k][i][j].slice(1, neighbor_elems[k][i][j].length);
                    for (let p = 0; p < classes.length; p++) {
                        classes[p] =  classes[p].split(":")[0]
                    }
                    
                    ccs_array[k].push({z: i,tag: neighbor_elems[k][i][j][0], classes});
                }
            } 
        }
        
        if(css_rule.cssText.match(/{\s}/) == null) allRules_0.push({selectorText: ccs_array, cssText: css_rule.cssText, type: css_rule.type});
        }
    
}
let document_ccs = "";
let document_structure = [];
function throw_children(html_element, level, all_classes) {
    level = level || 0;
    all_classes||=[];
    
    
    let level_classList = all_classes.slice();
    level_classList.unshift({classes: html_element.classList.value.split(" "), tag: html_element.tagName.toLowerCase(), level });
    document_structure.push(level_classList);

    for(let i =0; i<allRules_0.length; i++){
        if(allRules_0[i]?.selectorText != undefined){
    elems_rule: for (const diff_elem of allRules_0[i].selectorText) {
                let amount_rules = 0;
                let previous_t =0;
                let previous_z = 0; 
                for (let rule of diff_elem.slice().reverse()) {                    
                    for (let t = 0; t< level_classList.length; t++) {
                        let html_el_tree = level_classList[t];
                        html_el_tree.classes = removeDuplicates(html_el_tree.classes);
                        if(previous_z>rule.z&&t>(previous_t+1)){
                            break;
                        } 
                        
                        let includes_true = 0;
                        for (let html_el_tree_class of html_el_tree.classes) {
                            if(html_el_tree_class == "") break;
                            if(rule.classes.includes(html_el_tree_class)){
                                includes_true++;
                            }                           
                        }
                        let level_state = false;
                        level_state = ((rule.classes.length==0&&html_el_tree.classes.length==0||html_el_tree.classes.length>=rule.classes.length&&includes_true == rule.classes.length)&&(html_el_tree.tag == rule.tag||rule.tag=="")&& allRules_0[i]?.cssText != undefined);
                        if(level_state) amount_rules++;
                        if(amount_rules == diff_elem.length&&level_state){
                            document_ccs += `${"\t".repeat(level)}${allRules_0[i].cssText}\n`
                            delete allRules_0[i];
                            break elems_rule;
                        }
                        if(level_state) {
                            previous_t = t;
                            previous_z = rule.z;
                            break; 
                        } 
                            
                    }                   
                    
                }
                
            }
            
        }
        
    }

    level++;
    let element_children = html_element.children;
    for(let i = 0; i<element_children.length; i++){
        
        if (element_children[i] === undefined) break;
       
        throw_children(element_children[i], level, level_classList); 
    
    }
    
}
throw_children(document.body);

console.log(document_ccs);
