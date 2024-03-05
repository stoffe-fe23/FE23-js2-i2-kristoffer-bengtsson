class e{#e;#t;constructor(e,t=""){this.#e=e,this.#t=t}async getJson(e="",t=null){let s=await fetch(this.#s(e,t)),r=await s.json();return s.ok||this.#r(s,r),r}async postJson(e="",t=null,s=null){let r=await fetch(this.#s(e,s),this.#n("POST",t??{})),n=await r.json();return r.ok||this.#r(r,n),n}async updateJson(e="",t=null,s=null){let r=await fetch(this.#s(e,s),this.#n("PATCH",t??{})),n=await r.json();return r.ok||this.#r(r,n),n}async deleteJson(e="",t=null,s=null){let r=await fetch(this.#s(e,s),this.#n("DELETE",t??{})),n=await r.json();return r.ok||this.#r(r,n),n}formdataToJson(e){var t={};return e instanceof FormData&&e.forEach((e,s)=>{let r=isNaN(e)?e:parseInt(e);r="true"===r||"false"!==r&&r,s in t?(Array.isArray(t[s])||(t[s]=[t[s]]),t[s].push(r)):t[s]=r}),JSON.stringify(t)}#r(e,s){if(400==e.status){if(s.error&&s.data&&"Validation error"==s.error){if(Array.isArray(s.data)){let r="<ul>";if(s.data.length)for(let e of s.data)r+=`<li>${e.msg??"No message"}</li>`;else r+=`<li>${s.error}</li>`;throw r+="</ul>",new t(e.status,r)}}else throw new t(e.status,`API Error: ${s.error??""}  (${e.statusText})`)}else if(500==e.status)throw new t(e.status,`API Error: ${s.error??""}  (${e.statusText})`);else throw new t(e.status,`API Error: ${e.statusText}`)}#s(e="",t=null){let s=new URL(`${this.#e}${e.length?"/"+e:""}${this.#t}`);if(t)for(let e in t)s.searchParams.append(e,t[e]);return s}#n(e,t){return{method:e,headers:{"Content-Type":"application/json"},body:t instanceof FormData?this.formdataToJson(t):JSON.stringify(t)}}}class t extends Error{#a;constructor(e,t){super(t),this.#a=e}get errorCode(){return this.#a}}function s(e,t,s=null,a="",o=null,i=!1){var l;let u=document.createElement(e);if(e=e.toLowerCase(),function(e,t=1){return null!=e&&"object"==typeof e&&Object.keys(e).length>=t}(o,1))for(let e in o)u.setAttribute(e,o[e]);if(null!=(l=u)&&a.length>0&&(Array.isArray(a)?l.classList.add(...a):n(a)&&l.classList.add(a)),function(e,t=1){return null!=e&&Array.isArray(e)&&void 0!==e.length&&e.length>=t}(t)){if("ul"==e||"ol"==e)for(let e of t){let t=document.createElement("li");r(t,e,i),u.appendChild(t)}else if("select"==e||"datalist"==e)for(let e of t){let[t,s,n]=e.split("|"),a=document.createElement("option");if(r(a,s??t,i),a.value=t,void 0!==n){let e=u.querySelector(`optgroup[label="${n}"]`);null==e&&((e=document.createElement("optgroup")).label=n,u.appendChild(e)),e.appendChild(a)}else u.appendChild(a)}else r(u,t[0],i)}else if(n(t,1)){if("img"==e)u.alt=t;else if("input"==e&&t.length>0){let e=u,s=document.createElement("label");(u=document.createElement("div")).id=`${e.id}-wrapper`,a.length>0&&u.classList.add((Array.isArray(a)?a[0]:a)+"-wrapper"),s.setAttribute("for",e.id),r(s,t,i),"radio"==e.getAttribute("type")||"checkbox"==e.getAttribute("type")?(s.classList.add("input-box-label"),u.append(e,s)):u.append(s,e)}else r(u,t,i)}return null!=s&&s.appendChild(u),u}function r(e,t,s){s?e.innerHTML=t:e.innerText=t}function n(e,t=1){return null!=e&&void 0!==e.length&&e.length>=t}function a({message:e}){let t=document.querySelector("#errors");t.innerHTML="";let r=s("div","",t,"error-message");s("h2","Error",r),s("div",e,r,"error-box-message",null,!0),s("button","OK",r,"error-close-button").addEventListener("click",e=>{e.currentTarget.closest("dialog").close()}),console.error(e),t.showModal()}const o=new class{api;#o;constructor(t){this.api=new e(t)}deleteTask(e){this.api.deleteJson(`delete/${e}`).then(this.showTasks.bind(this)).catch(a)}setTaskDone(e){this.api.updateJson(`done/${e}`).then(this.showTasks.bind(this)).catch(a)}assignTask(e){this.api.updateJson("assign",e).then(this.showTasks.bind(this)).catch(a)}addNewTask(e){this.api.postJson("add",e).then(this.showTasks.bind(this)).catch(a)}showTasks(){this.api.getJson("list").then(e=>{let t={todo:document.querySelector("#tasks-todo-box"),wip:document.querySelector("#tasks-wip-box"),done:document.querySelector("#tasks-done-box")};if(Object.values(t).forEach(e=>{e.innerHTML=""}),e.length)for(let r of(e.sort((e,t)=>t.time-e.time),e))t[r.state].appendChild(function(e,t){let r=s("article",e.message,null,["task-box",`color-${e.category}`],{taskid:e.taskid});switch(e.state){case"todo":let n=s("form","",r,"task-assign-form");s("input","",n,"",{placeholder:"Assign task to",type:"text",name:"assigned",minlength:"2",maxlength:"20",required:"true"}),s("button","Assign",n),t&&n.addEventListener("submit",t);break;case"wip":s("div",e.assigned,r,"assigned-to");let a=s("div","",r,"task-button-wrapper");s("button","Done »",a);break;case"done":s("div",e.assigned,r,"assigned-to");let o=s("div","",r,"task-delete-wrapper");s("button","X",o)}return r}(r,this.#o))}).catch(a)}setOnAssignTaskEvent(e){"function"==typeof e&&(this.#o=e)}}("http://localhost:3000/tasks");o.setOnAssignTaskEvent(e=>{e.preventDefault();let t=new FormData(e.currentTarget);t.set("taskid",e.submitter.closest("article").getAttribute("taskid")),o.assignTask(t)}),document.querySelector("#new-task-form").addEventListener("submit",e=>{e.preventDefault();let t=new FormData(e.currentTarget,e.submitter);o.addNewTask(t),e.currentTarget.reset()}),document.querySelector("#tasks-wip-box").addEventListener("submit",e=>{e.preventDefault();let t=e.submitter.closest("article").getAttribute("taskid");t?o.setTaskDone(t):console.error("Error marking task as done: Task ID not found!")}),document.querySelector("#tasks-done-box").addEventListener("submit",e=>{e.preventDefault();let t=e.submitter.closest("article").getAttribute("taskid");t?confirm("Are you sure you wish to delete this task?")&&o.deleteTask(t):console.error("Error deleting task: Task ID not found!")}),o.showTasks();
//# sourceMappingURL=index.3540bde8.js.map
