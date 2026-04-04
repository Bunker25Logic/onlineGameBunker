import{e as l,B as u,G as M,M as N,C as b,f as r,S as x,g as S,h,A as I,D as R,i as s}from"./index-vgodyFfQ.js";class d{static async simularBatalha(a,t){l.emit("log",`⚔️ Entrando na Arena: DESAFIO CONTRA ${t.name}`);const o={uid:t.uid,name:t.name,level:t.level||1,hp:t.stats.hp,maxHp:t.stats.hp,atk:t.stats.atk,speed:t.stats.speed||10,skills:t.skills||{fogo:0,gelo:0,agua:0,raio:0,raioNegro:0},mesh:this.createOpponentMesh(t.classId||"guerreiro"),_oppTime:0,update:function(e){this.mesh&&(this._oppTime=(this._oppTime||0)+e,this.mesh.position.y=0+Math.sin(this._oppTime*3)*.12)}};return u.game.renderer.scene.add(o.mesh),u.start(a,o,!0),{result:"active_battle"}}static createOpponentMesh(a){const t=new M,e={guerreiro:16755200,arqueiro:3407701,mage:3386111,assaltante:16776960,elite:8913151}[a]||16755200,n=new N({color:2763306,metalness:.8,roughness:.3,emissive:e,emissiveIntensity:.3}),i=new b(.5,.4,1.2,8),p=new r(i,n);p.position.y=.6,t.add(p);const w=new x(.35,16,16),c=new r(w,n);c.position.y=1.45,t.add(c);const A=new S(.4,.1,.2),m=new h({color:e}),f=new r(A,m);f.position.set(0,1.45,.3),t.add(f);const E=new x(.2,8,8),g=new r(E,m);g.position.set(0,.7,.4),t.add(g);const O=new b(.6,.8,1.2,16,1,!0),T=new h({color:e,transparent:!0,opacity:.08,side:R,depthWrite:!1,blending:I}),v=new r(O,T);return v.position.y=.6,t.add(v),t.scale.setScalar(1.05),t}static async salvarDefesa(a){await s.setDefense(a.uid,a),l.emit("log","🛡️ Defesa sincronizada com o Bunker Solar.")}static async carregarRankings(){const a=await s.getLeaderboard("pvpWins"),t=await s.getLeaderboard("monstersKilled");return{pvpRank:a,killRank:t}}}class y{static show(){new y().showArenaModal()}constructor(){this.modal=null}showArenaModal(){if(!window.currentPlayer){l.emit("log","⚠️ Aguarde o carregamento total do herói...");return}const a=document.getElementById("pvp-modal");a&&a.remove(),this.modal=document.createElement("div"),this.modal.id="pvp-modal",this.modal.className="ui-glass-panel",this.modal.style.cssText=`
      position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
      width:450px; max-width:95vw; max-height:85vh; overflow-y:auto; padding:20px; z-index:500;
      border: 2px solid #ff33ff; box-shadow: 0 0 40px rgba(255,51,255,0.3);
      pointer-events: auto;
    `,this.modal.innerHTML=`
      <h2 style="font-family:'Cinzel'; text-align:center; color:#ff33ff; margin-bottom:15px; letter-spacing:2px;">⚔️ ARENA PvP</h2>
      
      <div id="pvp-tabs-bar" style="display:flex; gap:5px; margin-bottom:15px;">
        <button class="tab-btn active" data-tab="OPONENTES" style="flex:1; font-size:10px; padding:8px;">DESAFIOS</button>
        <button class="tab-btn" data-tab="RANKING" style="flex:1; font-size:10px; padding:8px;">RANKINGS</button>
        <button class="tab-btn" data-tab="HISTORICO" style="flex:1; font-size:10px; padding:8px;">LOGS</button>
      </div>

      <!-- ÁREA DE CONTEÚDO DINÂMICO -->
      <div id="pvp-dynamic-content" style="min-height:200px; background:rgba(0,0,0,0.2); border-radius:8px; padding:10px;">
        <div style="text-align:center; padding:50px;">Carregando dados...</div>
      </div>

      <button id="btn-save-def" class="btn-glass" style="width:100%; margin-top:15px; border-color:#39ff14; color:#39ff14; font-weight:bold;">🛡️ ATUALIZAR MINHA DEFESA</button>
      <button id="btn-close-pvp" class="btn-glass" style="width:100%; margin-top:10px; border-color:#ff3333; color:#ff3333; font-weight:bold;">❌ VOLTAR AO MUNDO</button>
    `,document.body.appendChild(this.modal),document.getElementById("btn-close-pvp").onclick=()=>this.modal.remove(),document.getElementById("btn-save-def").onclick=()=>{d.salvarDefesa(window.currentPlayer),this.modal.remove()},this.modal.querySelectorAll(".tab-btn").forEach(t=>{t.onclick=()=>{this.modal.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),t.classList.add("active"),this.renderTabContent(t.getAttribute("data-tab"))}}),this.renderTabContent("OPONENTES")}async renderTabContent(a){const t=document.getElementById("pvp-dynamic-content");if(t){t.innerHTML='<div style="text-align:center; padding:50px;">Buscando informações no Bunker Solaris...</div>';try{if(a==="OPONENTES"){const o=await Promise.race([s.getArenaOpponents(window.currentPlayer.uid),new Promise((e,n)=>setTimeout(()=>n(new Error("timeout")),5e3))]);t.innerHTML=o.length>0?o.map(e=>`
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(255,255,255,0.06); border-radius:8px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.1);">
              <div>
                <div style="font-size:15px; font-weight:bold; color:#fff;">${e.name||"Guerreiro"}</div>
                <div style="font-size:11px; color:#aaa;">Nv. ${e.level} | Mestre elemental</div>
              </div>
              <button class="btn-glass btn-atk-pvp" data-uid="${e.uid}" style="border-color:#ff4444; color:#ff4444;">LUTAR</button>
            </div>
          `).join(""):'<div style="text-align:center; padding:30px; color:#888;">Nenhum oponente disponível no momento.</div>',t.querySelectorAll(".btn-atk-pvp").forEach((e,n)=>{e.onclick=()=>this.startBattleSim(o[n])})}if(a==="RANKING"){const{pvpRank:o,killRank:e}=await d.carregarRankings();t.innerHTML=`
          <h4 style="margin:0 0 10px 0; color:#ff33ff; font-family:'Cinzel';">🏆 HALL DA FAMA (PvP)</h4>
          <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:5px; margin-bottom:15px;">
             ${o.map((n,i)=>`<div style="font-size:13px; margin:5px 0;">#${i+1} <b>${n.displayName||"Soldado"}</b> — ${n.pvpWins||0} Vits</div>`).join("")}
          </div>
          <h4 style="margin:0 0 10px 0; color:#39ff14; font-family:'Cinzel';">👹 EXTERMINADORES</h4>
          <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:5px;">
             ${e.map((n,i)=>`<div style="font-size:13px; margin:5px 0;">#${i+1} <b>${n.displayName||"Soldado"}</b> — ${n.monstersKilled||0} Kills</div>`).join("")}
          </div>
        `}if(a==="HISTORICO"){const o=await s.getPvPNotifications(window.currentPlayer.uid);t.innerHTML=o.length>0?o.reverse().map(e=>`
            <div style="padding:12px; background:rgba(0,0,0,0.3); margin-bottom:8px; border-radius:8px; border-left:4px solid ${e.resultado==="VITORIA"?"#ff3333":"#39ff14"};">
              <div style="font-weight:bold; color:#fff;">🛡️ DEFESA: ${e.resultado==="VITORIA"?"VOCÊ FOI DERROTADO":"VOCÊ SUPEROU O ATAQUE"}</div>
              <div style="color:#777; font-size:10px; margin-top:5px;">Data: ${new Date(e.timestamp).toLocaleString()}</div>
            </div>
          `).join(""):'<div style="text-align:center; padding:30px; color:#888;">Nenhuma atividade defensiva recente.</div>'}}catch(o){console.warn("[ARENA] Erro de rede:",o),t.innerHTML=`
        <div style="text-align:center; padding:30px; color:#ff4444;">
          ⚠️ Erro ao carregar aba. <br><br>
          <small style="color:#888;">Possível timeout ou índice do Firestore pendente.</small>
        </div>
      `}}}async startBattleSim(a){const t=document.getElementById("pvp-dynamic-content");t.innerHTML=`<div style="text-align:center; padding:50px; font-family:'Cinzel'; font-size:20px;">⚔️ PREPARANDO ARENA...</div>`;const o=await d.simularBatalha(window.currentPlayer,a),{log:e,result:n}=o||{};if(!e){const i=document.getElementById("pvp-modal");i&&i.remove();return}t.innerHTML=`
      <div style="background:rgba(0,0,0,0.6); padding:15px; height:250px; overflow-y:auto; border-radius:8px; font-family:'Share Tech Mono'; font-size:12px; line-height:1.5; color:#39ff14; border:1px solid rgba(57,255,20,0.2);">
        ${e.map(i=>`<div>${i}</div>`).join("")}
      </div>
      <div style="text-align:center; margin-top:15px; font-family:'Cinzel'; color:${n==="VITORIA"?"#ffd700":"#ff4444"}; font-size:32px; text-shadow:0 0 15px currentColor;">${n}</div>
    `}}export{y as PvPUI};
