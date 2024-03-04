function e(e,t=1){return null!=e&&void 0!==e.length&&e.length>=t}function t(t,s,n=null,o="",a=null,l=!1){var i;let u=document.createElement(t);if(t=t.toLowerCase(),function(e,t=1){return null!=e&&"object"==typeof e&&Object.keys(e).length>=t}(a,1))for(let e in a)u.setAttribute(e,a[e]);if(null!=(i=u)&&o.length>0&&(Array.isArray(o)?i.classList.add(...o):e(o)&&i.classList.add(o)),function(e,t=1){return null!=e&&Array.isArray(e)&&void 0!==e.length&&e.length>=t}(s)){if("ul"==t||"ol"==t)for(let e of s){let t=document.createElement("li");r(t,e,l),u.appendChild(t)}else if("select"==t||"datalist"==t)for(let e of s){let[t,s,n]=e.split("|"),o=document.createElement("option");if(r(o,s??t,l),o.value=t,void 0!==n){let e=u.querySelector(`optgroup[label="${n}"]`);null==e&&((e=document.createElement("optgroup")).label=n,u.appendChild(e)),e.appendChild(o)}else u.appendChild(o)}else r(u,s[0],l)}else if(e(s,1)){if("img"==t)u.alt=s;else if("input"==t&&s.length>0){let e=u,t=document.createElement("label");(u=document.createElement("div")).id=`${e.id}-wrapper`,o.length>0&&u.classList.add((Array.isArray(o)?o[0]:o)+"-wrapper"),t.setAttribute("for",e.id),r(t,s,l),"radio"==e.getAttribute("type")||"checkbox"==e.getAttribute("type")?(t.classList.add("input-box-label"),u.append(e,t)):u.append(t,e)}else r(u,s,l)}return null!=n&&n.appendChild(u),u}function r(e,t,r){r?e.innerHTML=t:e.innerText=t}class s extends Error{#e;constructor(e,t){super(t),this.#e=e}get errorCode(){return this.#e}}function n(e){let r=document.querySelector("#errors");r.innerHTML="",t("h2","Error",r),t("div",e,r,"error-box-message",null,!0),t("button","OK",r,"error-close-button").addEventListener("click",e=>{e.currentTarget.closest("dialog").close()}),r.showModal()}const o=new class{#t;#r;constructor(e,t=""){this.#t=e,this.#r=t}async getJson(e="",t=null){let r=this.#s(e,t),s=await fetch(r),n=await s.json();return s.ok||this.#n(s,n),n}async postJson(e,t="",r=null){e=e??{};let s=this.#s(t,r),n={method:"POST",headers:{"Content-Type":"application/json"},body:e instanceof FormData?this.formdataToJson(e):JSON.stringify(e)},o=await fetch(s,n),a=await o.json();return o.ok||this.#n(o,a),a}async updateJson(e=null,t="",r=null){e=e??{};let s=this.#s(t,r),n={method:"PATCH",headers:{"Content-Type":"application/json"},body:e instanceof FormData?this.formdataToJson(e):JSON.stringify(e)},o=await fetch(s,n),a=await o.json();return o.ok||this.#n(o,a),a}async deleteJson(e=null,t="",r=null){e=e??{};let s=this.#s(t,r),n={method:"DELETE",headers:{"Content-Type":"application/json"},body:e instanceof FormData?this.formdataToJson(e):JSON.stringify(e)},o=await fetch(s,n),a=await o.json();return o.ok||this.#n(o,a),a}formdataToJson(e){var t={};return e instanceof FormData&&e.forEach((e,r)=>{let s=isNaN(e)?e:parseInt(e);s="true"===s||"false"!==s&&s,r in t?(Array.isArray(t[r])||(t[r]=[t[r]]),t[r].push(s)):t[r]=s}),JSON.stringify(t)}#n(e,t){if(400==e.status){if(t.error&&t.data&&"Validation error"==t.error){if(Array.isArray(t.data)){let r="<ul>";if(t.data.length)for(let e of t.data)r+=`<li>${e.msg??"No message"}</li>`;else r+=`<li>${t.error}</li>`;throw r+="</ul>",new s(e.status,r)}}else throw new s(e.status,`API Error: ${t.error??""}  (${e.statusText})`)}else if(500==e.status)throw new s(e.status,`API Error: ${t.error??""}  (${e.statusText})`);else throw new s(e.status,`API Error: ${e.statusText}`)}#s(e="",t=null){let r=new URL(`${this.#t}${e.length>0?"/"+e:""}${this.#r}`);if(t)for(let e in t)r.searchParams.append(e,t[e]);return r}}("http://localhost:3000/tasks");function a(){o.getJson("list").then(e=>{let r={todo:document.querySelector("#tasks-todo-box"),wip:document.querySelector("#tasks-wip-box"),done:document.querySelector("#tasks-done-box")};if(Object.values(r).forEach(e=>{e.innerHTML=""}),e.length)for(let s of(e.sort((e,t)=>t.time-e.time),e)){let e=function(e,r){let s=t("article",e.message,null,["task-box",`color-${e.category}`],{taskid:e.taskid});switch(e.state){case"todo":let n=t("form","",s,"task-assign-form");t("input","",n,"",{placeholder:"Assign task to",type:"text",name:"assigned",minlength:"2",maxlength:"20",required:"true"}),t("button","Assign",n),n.addEventListener("submit",r);break;case"wip":t("div",e.assigned,s,"assigned-to");let o=t("div","",s,"task-button-wrapper");t("button","Done »",o);break;case"done":t("div",e.assigned,s,"assigned-to");let a=t("div","",s,"task-delete-wrapper");t("button","X",a)}return s}(s,l);r[s.state].appendChild(e)}}).catch(e=>{n(e.message)})}function l(e){e.preventDefault();let t=new FormData(e.currentTarget);t.set("taskid",e.submitter.closest("article").getAttribute("taskid")),function(e){o.updateJson(e,"assign").then(()=>{a()}).catch(e=>{n(e.message)})}(t),e.currentTarget.reset()}a(),document.querySelector("#tasks-wip-box").addEventListener("submit",e=>{e.preventDefault();let t=e.submitter.closest("article").getAttribute("taskid");t?function(e){o.updateJson(null,`done/${e}`).then(()=>{a()}).catch(e=>{n(e.message)})}(t):console.error("Error marking task as done: Task ID not found!")}),document.querySelector("#tasks-done-box").addEventListener("submit",e=>{e.preventDefault();let t=e.submitter.closest("article").getAttribute("taskid");t?confirm("Are you sure you wish to delete this task?")&&function(e){o.deleteJson(null,`delete/${e}`).then(()=>{a()}).catch(e=>{n(e.message)})}(t):console.error("Error deleting task: Task ID not found!")}),document.querySelector("#new-task-form").addEventListener("submit",e=>{e.preventDefault(),function(e){o.postJson(e,"add").then(()=>{a()}).catch(e=>{n(e.message)})}(new FormData(e.currentTarget,e.submitter)),e.currentTarget.reset()});
//# sourceMappingURL=index.54824b51.js.map
