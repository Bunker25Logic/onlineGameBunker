import{D as r,e as l}from"./index-DlpPRXwp.js";class p{static async simularBatalha(t,e){let a=[`⚔️ Desafio Iniciado: ${t.uid.slice(0,5)} VS ${e.name}`],o=t.hp,n=e.stats.hp;t.mana;let i=1,c=null;for(;o>0&&n>0&&i<100;){a.push(`── Turno ${i} ──`);const f=15+t.bonusAtk+Math.floor(Math.random()*10);if(n-=f,a.push(`🔹 Atacante causou ${f} de dano.`),n<=0){c="player";break}if(n<e.stats.hp*.3){const d=20+Math.floor(Math.random()*10);n=Math.min(e.stats.hp,n+d),a.push(`🔸 Defensor [IA] usou CURA: +${d} HP.`)}else{const d=e.stats.atk+Math.floor(Math.random()*12);o-=d,a.push(`🔸 Defensor causou ${d} de dano.`)}if(o<=0){c="defense";break}i++}const s=c==="player"?"VITORIA":"DERROTA";return a.push(`🏁 Resultado: ${s}`),await r.recordPvPBattle({atacanteId:t.uid,defensorId:e.uid,resultado:s,log:a}),s==="VITORIA"?(t.pvpWins++,t.gold+=100,l.emit("log","🏆 Vitória PvP! +100 Ouro e +1 Win no Ranking.")):l.emit("log","💀 Derrota PvP... Tente melhorar seus atributos."),t.saveData(),{result:s,log:a}}static async salvarDefesa(t){await r.setDefense(t.uid,t),l.emit("log","🛡️ Defesa sincronizada com o Bunker Solar.")}static async carregarRankings(){const t=await r.getLeaderboard("pvpWins"),e=await r.getLeaderboard("monstersKilled");return{pvpRank:t,killRank:e}}}class m{static show(){new m().showArenaModal()}constructor(){this.modal=null}showArenaModal(){if(!window.currentPlayer){l.emit("log","⚠️ Aguarde o carregamento total do herói...");return}const t=document.getElementById("pvp-modal");t&&t.remove(),this.modal=document.createElement("div"),this.modal.id="pvp-modal",this.modal.className="ui-glass-panel",this.modal.style.cssText=`
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
    `,document.body.appendChild(this.modal),document.getElementById("btn-close-pvp").onclick=()=>this.modal.remove(),document.getElementById("btn-save-def").onclick=()=>{p.salvarDefesa(window.currentPlayer),this.modal.remove()},this.modal.querySelectorAll(".tab-btn").forEach(e=>{e.onclick=()=>{this.modal.querySelectorAll(".tab-btn").forEach(a=>a.classList.remove("active")),e.classList.add("active"),this.renderTabContent(e.getAttribute("data-tab"))}}),this.renderTabContent("OPONENTES")}async renderTabContent(t){const e=document.getElementById("pvp-dynamic-content");if(e){e.innerHTML='<div style="text-align:center; padding:50px;">Buscando informações no Bunker Solaris...</div>';try{if(t==="OPONENTES"){const a=await Promise.race([r.getArenaOpponents(window.currentPlayer.uid),new Promise((o,n)=>setTimeout(()=>n(new Error("timeout")),5e3))]);e.innerHTML=a.length>0?a.map(o=>`
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(255,255,255,0.06); border-radius:8px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.1);">
              <div>
                <div style="font-size:15px; font-weight:bold; color:#fff;">${o.name||"Guerreiro"}</div>
                <div style="font-size:11px; color:#aaa;">Nv. ${o.level} | Mestre elemental</div>
              </div>
              <button class="btn-glass btn-atk-pvp" data-uid="${o.uid}" style="border-color:#ff4444; color:#ff4444;">LUTAR</button>
            </div>
          `).join(""):'<div style="text-align:center; padding:30px; color:#888;">Nenhum oponente disponível no momento.</div>',e.querySelectorAll(".btn-atk-pvp").forEach((o,n)=>{o.onclick=()=>this.startBattleSim(a[n])})}if(t==="RANKING"){const{pvpRank:a,killRank:o}=await p.carregarRankings();e.innerHTML=`
          <h4 style="margin:0 0 10px 0; color:#ff33ff; font-family:'Cinzel';">🏆 HALL DA FAMA (PvP)</h4>
          <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:5px; margin-bottom:15px;">
             ${a.map((n,i)=>`<div style="font-size:13px; margin:5px 0;">#${i+1} <b>${n.displayName||"Soldado"}</b> — ${n.pvpWins||0} Vits</div>`).join("")}
          </div>
          <h4 style="margin:0 0 10px 0; color:#39ff14; font-family:'Cinzel';">👹 EXTERMINADORES</h4>
          <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:5px;">
             ${o.map((n,i)=>`<div style="font-size:13px; margin:5px 0;">#${i+1} <b>${n.displayName||"Soldado"}</b> — ${n.monstersKilled||0} Kills</div>`).join("")}
          </div>
        `}if(t==="HISTORICO"){const a=await r.getPvPNotifications(window.currentPlayer.uid);e.innerHTML=a.length>0?a.reverse().map(o=>`
            <div style="padding:12px; background:rgba(0,0,0,0.3); margin-bottom:8px; border-radius:8px; border-left:4px solid ${o.resultado==="VITORIA"?"#ff3333":"#39ff14"};">
              <div style="font-weight:bold; color:#fff;">🛡️ DEFESA: ${o.resultado==="VITORIA"?"VOCÊ FOI DERROTADO":"VOCÊ SUPEROU O ATAQUE"}</div>
              <div style="color:#777; font-size:10px; margin-top:5px;">Data: ${new Date(o.timestamp).toLocaleString()}</div>
            </div>
          `).join(""):'<div style="text-align:center; padding:30px; color:#888;">Nenhuma atividade defensiva recente.</div>'}}catch(a){console.warn("[ARENA] Erro de rede:",a),e.innerHTML=`
        <div style="text-align:center; padding:30px; color:#ff4444;">
          ⚠️ Erro ao carregar aba. <br><br>
          <small style="color:#888;">Possível timeout ou índice do Firestore pendente.</small>
        </div>
      `}}}async startBattleSim(t){const e=document.getElementById("pvp-dynamic-content");e.innerHTML=`<div style="text-align:center; padding:50px; font-family:'Cinzel'; font-size:20px;">⚔️ SIMULANDO COMBATE...</div>`;const{log:a,result:o}=await p.simularBatalha(window.currentPlayer,t);e.innerHTML=`
      <div style="background:rgba(0,0,0,0.6); padding:15px; height:250px; overflow-y:auto; border-radius:8px; font-family:'Share Tech Mono'; font-size:12px; line-height:1.5; color:#39ff14; border:1px solid rgba(57,255,20,0.2);">
        ${a.map(n=>`<div>${n}</div>`).join("")}
      </div>
      <div style="text-align:center; margin-top:15px; font-family:'Cinzel'; color:${o==="VITORIA"?"#ffd700":"#ff4444"}; font-size:32px; text-shadow:0 0 15px currentColor;">${o}</div>
    `}}export{m as PvPUI};
