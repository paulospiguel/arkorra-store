#!/usr/bin/env python3
"""Assemble the Arkorra printable guides (HTML + PDF).

Common chapters (phone numbers, scenarios, how to use materials) are taken from
guia-familia.html so every guide stays consistent. Profile chapters live here.

Run:  python3 docs/guides/build.py
"""
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

SRC = (HERE / "guia-familia.html").read_text()
SECTIONS = re.findall(r"<section[^>]*>.*?</section>", SRC, re.S)


def sect(i):
    return SECTIONS[i]


def strip_num(html):
    return re.sub(r"<h2>\d+\.\s*", "<h2>", html, count=1)


def h2_renumber(chapters):
    out = []
    for n, ch in enumerate(chapters, 1):
        out.append(re.sub(r"<h2>", f"<h2>{n}. ", ch, count=1))
    return out


COMMON_TELEFONES = strip_num(sect(1))
COMMON_CENARIOS = strip_num(sect(2))
COMMON_MATERIAIS = strip_num(sect(4))
FAMILIA_CRIANCAS = strip_num(sect(5))
FAMILIA_EVAC = strip_num(sect(6))

LINE = '<tr>' + '<td class="line">&nbsp;</td>' * 3 + '</tr>\n'
CONTACTOS = f"""<section>
  <h2>Folha de contactos</h2>
  <p class="small">Preenche a caneta. Guarda uma cópia na mochila e outra junto à porta.</p>
  <table><tr><th>Nome</th><th>Telefone</th><th>Relação / Notas</th></tr>
  {LINE * 7}</table>
  <div class="grid2">
    <div class="box"><h3>Médico / centro de saúde</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Contacto fora da zona</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Ponto de encontro 1</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Ponto de encontro 2</h3><div class="line"></div><div class="line"></div></div>
  </div>
</section>"""

INVENTARIO = """<section>
  <h2>Inventário e revisão semestral</h2>
  <table>
    <tr><th>Item</th><th>Quantidade</th><th>Validade / revisão</th><th>Local</th></tr>
    <tr><td>Água</td><td></td><td></td><td></td></tr>
    <tr><td>Comida</td><td></td><td></td><td></td></tr>
    <tr><td>Medicamentos</td><td></td><td></td><td></td></tr>
    <tr><td>Primeiros socorros</td><td></td><td></td><td></td></tr>
    <tr><td>Lanternas e pilhas</td><td></td><td></td><td></td></tr>
    <tr><td>Rádio e powerbank</td><td></td><td></td><td></td></tr>
    <tr><td>Documentos</td><td></td><td></td><td></td></tr>
    <tr><td>Numerário</td><td></td><td></td><td></td></tr>
    <tr><td class="line">&nbsp;</td><td></td><td></td><td></td></tr>
    <tr><td class="line">&nbsp;</td><td></td><td></td><td></td></tr>
  </table>
  <h3>Revisão de 6 em 6 meses</h3>
  <ul class="chk">
    <li>Mudar a água e verificar validades de comida e medicamentos</li>
    <li>Testar lanternas, rádio e powerbank; trocar pilhas</li>
    <li>Atualizar contactos e medicação</li>
    <li>Rever o plano e ensaiar a saída de casa</li>
    <li>Repor o numerário e atualizar as cópias dos documentos</li>
  </ul>
  <div class="box"><h3>Lembra-te</h3><p style="margin:0">Estar preparado não é viver com medo. É ter tudo pronto para depois viver com a cabeça tranquila. <b>Preparados hoje. Tranquilos amanhã.</b></p></div>
</section>"""

MEDICACAO = """<section>
  <h2>Folha de medicação e saúde</h2>
  <p class="small">Uma folha por pessoa. Entrega uma cópia a quem te ajuda e leva outra na mochila e no bolso.</p>
  <table>
    <tr><th>Medicamento</th><th>Dose</th><th>Horas</th><th>Para quê</th></tr>
    """ + ('<tr><td class="line">&nbsp;</td><td></td><td></td><td></td></tr>' * 8) + """
  </table>
  <div class="grid2">
    <div class="box"><h3>Alergias</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Doenças e equipamentos</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Médico e telefone</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Tipo sanguíneo / nº de utente</h3><div class="line"></div><div class="line"></div></div>
  </div>
</section>"""


def estocar(people, who, extra_rows="", note=""):
    water = people * 9
    return f"""<section>
  <h2>O que estocar (e quanto)</h2>
  <p>Valores base para <b>{who}</b> durante <b>72 horas</b> (3 dias). Multiplica por 2 ou 3 para uma reserva de 7 a 14 dias. {note}</p>
  <table>
    <tr><th>Categoria</th><th>Quantidade ({who}, 72 h)</th><th>Notas</th></tr>
    <tr><td>Água potável</td><td>{water} litros (3 L por pessoa e por dia)</td><td>2 L beber + 1 L cozinha e higiene. Garrafas fechadas. Renova a cada 6–12 meses.</td></tr>
    <tr><td>Comida não perecível</td><td>3 dias de refeições completas</td><td>Conservas, massa, arroz, leguminosas cozidas, fruta seca, bolachas, barras, frutos secos, leite UHT. Abre-latas manual.</td></tr>
    <tr><td>Luz</td><td>{max(people,2)} lanternas ou frontais + pilhas extra</td><td>Evita velas.</td></tr>
    <tr><td>Informação</td><td>Rádio de pilhas ou manivela</td><td>Pilhas de reserva. Powerbank carregado.</td></tr>
    <tr><td>Primeiros socorros</td><td>1 kit completo</td><td>Verifica validades.</td></tr>
    <tr><td>Medicamentos</td><td>7 a 14 dias da medicação habitual</td><td>Cópia das receitas. Alergias anotadas.</td></tr>
    <tr><td>Higiene</td><td>Papel higiénico, toalhitas, sabão, sacos do lixo, desinfetante</td><td>Máscaras. Produtos de higiene íntima.</td></tr>
    <tr><td>Calor e abrigo</td><td>Mantas, roupa por camadas, manta térmica</td><td>Uma por pessoa.</td></tr>
    <tr><td>Cozinhar</td><td>Fogareiro de campismo, cartuchos, fósforos/isqueiro</td><td>Só ao ar livre ou com ventilação total.</td></tr>
    <tr><td>Documentos e dinheiro</td><td>Cópias em saco impermeável, numerário</td><td>Cartão de cidadão, seguros, receitas, contactos.</td></tr>
    {extra_rows}
  </table>
</section>"""


# ------------------------------------------------------------ profile chapters
IDOSO = {
    "id": "idosos",
    "title": "Guia de preparação<br>para idosos",
    "lead": "O que fazer antes, durante e depois de um apagão, um ciberataque, uma calamidade ou uma falta de abastecimento. Letra grande, passos simples, com a saúde e a medicação em primeiro lugar.",
    "who_short": "Idosos",
    "css": "body{font-size:13.2pt;line-height:1.45} h1{font-size:36pt}",
    "estocar": estocar(
        2, "1 a 2 pessoas",
        extra_rows="<tr><td>Calçado e iluminação</td><td>Luzes de presença a pilhas nos corredores e casa de banho</td><td>Previne quedas no escuro.</td></tr>"
                   "<tr><td>Comida fácil</td><td>Latas com abertura fácil, papas, sopas, compotas, bolachas</td><td>Alimentos que mastigas e digeres bem. Embalagens leves.</td></tr>",
        note="Prefere garrafas de 1,5 L: pesam menos e são mais fáceis de levantar.",
    ),
    "chapters": [
        """<section>
  <h2>Medicação e equipamentos de saúde</h2>
  <div class="box alert"><p class="big" style="margin:0">A medicação é a prioridade número 1.</p>
  <p style="margin:.3em 0 0">Tem sempre <b>7 a 14 dias</b> da medicação de uso contínuo, uma lista escrita e uma cópia das receitas.</p></div>
  <ul class="chk">
    <li>Compra com antecedência, sem esperar pelo último comprimido.</li>
    <li>Usa uma caixa semanal de comprimidos. Se tens dificuldade, pede a um familiar para a preparar ao domingo.</li>
    <li>Escreve a lista (nome, dose, horas, para quê) na folha final e guarda uma cópia na carteira.</li>
    <li>Medicamentos que precisam de frio (insulina, por exemplo): pergunta ao teu médico ou farmácia como os conservar sem eletricidade e durante quanto tempo.</li>
    <li>Guarda os medicamentos no sítio fresco e seco e longe da luz do sol.</li>
  </ul>
  <h3>Equipamentos que dependem de eletricidade</h3>
  <p>Concentrador de oxigénio, cama articulada, aspirador, nebulizador, alarme de teleassistência, elevador de escada: <b>pensa já no que fazes se faltar a luz.</b></p>
  <ul class="chk">
    <li>Pergunta ao teu médico ou à empresa que fornece o equipamento qual é o plano alternativo e se há bateria de reserva.</li>
    <li>Pergunta ao teu comercializador de eletricidade ou à E-Redes se existe registo de cliente com necessidades especiais de saúde.</li>
    <li>Avisa o teu centro de saúde e um familiar de que dependes de um equipamento.</li>
    <li>Tem sempre um telefone de emergência de reserva e carregado (powerbank).</li>
  </ul>
</section>""",
        """<section>
  <h2>Sinais de alarme: quando ligar 112</h2>
  <div class="grid2">
    <div class="box alert"><h3>AVC</h3>
      <p class="small" style="margin:0"><b>Cara</b> descaída · <b>Braço</b> sem força · <b>Fala</b> arrastada · <b>Tempo</b>: liga 112 de imediato. Anota a hora a que começou.</p></div>
    <div class="box alert"><h3>Enfarte</h3>
      <p class="small" style="margin:0">Dor ou aperto no peito, falta de ar, suores frios, dor no braço ou na mandíbula, enjoo: liga 112. Senta-te e fica calmo.</p></div>
    <div class="box"><h3>Queda</h3>
      <p class="small" style="margin:0">Não te levantes depressa. Verifica se há dor forte, tontura ou ferida. Se não consegues levantar-te, chama por ajuda (apito, telefone, bater na parede). Liga 112 em caso de dor forte, deformação ou cabeça batida.</p></div>
    <div class="box"><h3>Desidratação / calor</h3>
      <p class="small" style="margin:0">Os idosos sentem menos sede. Bebe água aos poucos durante o dia, mesmo sem sede. Sinais: boca seca, tontura, confusão, urina escura.</p></div>
  </div>
  <div class="box"><h3>Frio</h3>
    <p class="small" style="margin:0">Veste camadas, usa gorro e meias grossas mesmo dentro de casa, come e bebe quente. Sinais de hipotermia: arrepios fortes, fala confusa, sonolência. Liga 112 se não melhorares.</p></div>
</section>""",
        """<section>
  <h2>Segurança em casa sem luz</h2>
  <ul class="chk">
    <li>Mantém uma <b>lanterna ao lado da cama</b>, com pilhas novas. Sabe sempre onde está.</li>
    <li>Luzes de presença a pilhas no corredor e casa de banho. Fita refletora nos degraus.</li>
    <li>Calça sempre sapatos fechados ao levantar-te. Evita chinelos.</li>
    <li>Mantém os caminhos livres de tapetes soltos e fios.</li>
    <li><b>Não uses velas.</b> Se for inevitável, usa um recipiente estável, longe de cortinas, e nunca ao deixar a divisão.</li>
    <li>Fogão a gás: nunca o uses para aquecer a casa. Mantém sempre uma janela ligeiramente aberta quando estiver ligado.</li>
    <li>Monóxido de carbono: aquecedores a gás ou a lenha precisam de boa ventilação. Se tiveres dor de cabeça, tonturas e enjoo ao mesmo tempo, sai para o ar livre e liga 112.</li>
  </ul>
  <h3>Comida e água simples</h3>
  <ul>
    <li>Come primeiro o que está no frigorífico, depois a despensa. Não abras a porta do frigorífico sem necessidade.</li>
    <li>Prepara refeições pequenas e frequentes. Evita comida muito salgada se tomas medicação para a tensão.</li>
    <li>Tem água engarrafada à mão numa prateleira baixa, para não te esforçares.</li>
  </ul>
</section>""",
        """<section>
  <h2>Solidão e rede de apoio</h2>
  <p>Uma rede curta e organizada vale mais do que muitos contactos. <b>Combina agora, não durante a crise.</b></p>
  <ol class="steps">
    <li><b>Escolhe 3 pessoas:</b> um familiar, um vizinho de confiança e um amigo. Troca com elas as chaves de reserva, se te sentires seguro.</li>
    <li><b>Combina uma chamada diária</b> à mesma hora. Se não atenderes, essa pessoa deve passar por tua casa.</li>
    <li><b>Dá-lhes a folha de medicação</b> e o contacto do teu médico.</li>
    <li><b>Mensagem-código:</b> “Estou bem” ou “Preciso de ajuda”. Uma palavra basta.</li>
    <li><b>Apito ou bater na parede:</b> sinal para os vizinhos, se estiveres sem telefone.</li>
  </ol>
  <h3>Apoio de teleassistência e serviços</h3>
  <ul>
    <li>Pergunta na junta de freguesia ou câmara municipal se há apoio domiciliário ou teleassistência para a tua zona.</li>
    <li>Linha SNS 24: <b>808 24 24 24</b> (aconselhamento de saúde).</li>
    <li>Num problema urgente, liga sempre <b>112</b>. Não tenhas vergonha de pedir ajuda.</li>
  </ul>
</section>""",
        """<section>
  <h2>Burlas e golpes nas crises</h2>
  <p>Os burlões usam o medo e a pressa. Aprende estas regras e ensina-as a quem vive contigo.</p>
  <div class="box alert">
    <ul style="margin:0" class="chk">
      <li><b>Nunca</b> dês o código do cartão, o PIN ou códigos recebidos por SMS, a ninguém. O banco nunca os pede.</li>
      <li><b>Não abras a porta</b> a “técnicos” ou “funcionários” que não esperavas. Pede identificação e liga tu para a empresa, pelo número oficial.</li>
      <li>“Um familiar está em apuros e precisa de dinheiro já”: desliga e liga tu para o familiar, no número que conheces.</li>
      <li>Não faças pagamentos nem transferências a pedido de mensagens ou chamadas. Quem tem pressa está a enganar-te.</li>
      <li>Em dúvida, <b>desliga</b> e fala com alguém de confiança.</li>
    </ul>
  </div>
</section>""",
        """<section>
  <h2>Plano de evacuação com apoio</h2>
  <ul class="chk">
    <li>Combina com um vizinho ou familiar <b>quem te ajuda a sair</b> de casa em caso de evacuação.</li>
    <li>Tem sempre à porta: bengala ou andarilho, óculos de reserva, aparelho auditivo e pilhas, e a mochila pronta.</li>
    <li>Se vives em andar alto e tens mobilidade reduzida, informa os bombeiros e o condomínio com antecedência.</li>
    <li>Mochila pequena e leve: medicação de 3 dias, folha de saúde, água, lanterna, rádio, casaco e documentos.</li>
    <li>Traz sempre um <b>cartão no bolso</b> com o teu nome, doenças, medicação, alergias e dois telefones de contacto.</li>
    <li>Fecha o gás, a água e a eletricidade ao sair, se for seguro.</li>
  </ul>
</section>""",
    ],
    "sheets": [CONTACTOS, MEDICACAO, INVENTARIO],
}

SOZINHO = {
    "id": "solteiro",
    "title": "Guia de preparação<br>para quem vive sozinho",
    "lead": "O essencial, sem excessos: o que guardar, o que saber fazer sozinho e como não ficar isolado. Para quem vive só e quer estar pronto sem ocupar uma casa inteira.",
    "who_short": "Solteiro(a)",
    "css": "",
    "estocar": estocar(
        1, "1 pessoa",
        extra_rows="<tr><td>Trabalho / comunicação</td><td>Powerbank grande, cabo extra, hotspot no telemóvel</td><td>Para trabalhar e comunicar sem rede fixa.</td></tr>"
                   "<tr><td>Espaço pequeno</td><td>Caixa única com tampa para todo o kit</td><td>Arruma debaixo da cama ou no armário.</td></tr>",
        note="O teu kit cabe numa caixa ou mochila. Apostar em itens leves e multifunções.",
    ),
    "chapters": [
        """<section>
  <h2>Cozinhar e comer com pouco espaço</h2>
  <ul>
    <li><b>Refeições de 1 pessoa:</b> lata de feijão ou grão + arroz instantâneo; atum + bolachas; sopa instantânea; papas de aveia; frutos secos e barras.</li>
    <li><b>Fogareiro pequeno:</b> um só cartucho dá para vários dias de refeições simples. Usa-o <b>só ao ar livre</b> ou com ventilação total.</li>
    <li><b>Sem fogão:</b> há muita comida que come fria (conservas de peixe, hummus em lata, fruta seca, queijo curado).</li>
    <li><b>Água:</b> 9 litros para 72 horas. Garrafas de 1,5 L são fáceis de guardar e de levantar.</li>
    <li>Compra a granel o que usas todos os dias e <b>roda o stock</b>: come o mais antigo e repõe.</li>
  </ul>
  <div class="box"><h3>Menu de 3 dias sem eletricidade (exemplo)</h3>
  <table class="small">
    <tr><th>Dia</th><th>Manhã</th><th>Almoço</th><th>Jantar</th></tr>
    <tr><td>1</td><td>Aveia com leite UHT</td><td>Atum, bolachas, fruta</td><td>Feijão com arroz instantâneo</td></tr>
    <tr><td>2</td><td>Pão de forma, compota</td><td>Grão de lata, milho, azeitonas</td><td>Sopa instantânea, queijo</td></tr>
    <tr><td>3</td><td>Cereais com leite</td><td>Sardinhas, pão, fruta seca</td><td>Massa com molho de lata</td></tr>
  </table></div>
</section>""",
        """<section>
  <h2>Não ficar isolado: rede e check-in</h2>
  <p>Viver sozinho tem uma vantagem (decides tudo) e um risco (ninguém repara se algo corre mal). A solução é uma <b>rede simples</b>.</p>
  <ol class="steps">
    <li><b>Duas pessoas de confiança:</b> uma perto (vizinho) e outra longe (família ou amigo). Dá-lhes uma chave, se te sentires seguro.</li>
    <li><b>Check-in diário:</b> uma mensagem curta à mesma hora. Se faltares, a pessoa liga e, se não atender, passa por tua casa ou chama ajuda.</li>
    <li><b>Mensagens-código:</b> “Estou bem” e “Preciso de ajuda”. Não precisas de mais.</li>
    <li><b>Partilha de localização</b> com uma pessoa de confiança em viagens e deslocações longas.</li>
    <li><b>Folha de saúde</b> na porta do frigorífico: nome, alergias, medicação, contacto de emergência.</li>
  </ol>
  <h3>Se ficares doente ou ferido sozinho</h3>
  <ul class="chk">
    <li>Sinais graves (dor no peito, falta de ar, perda de consciência, febre muito alta com confusão): liga <b>112</b> já.</li>
    <li>Sintomas leves: liga SNS 24 <b>808 24 24 24</b> e avisa alguém da tua rede.</li>
    <li>Deixa a porta destrancada ou a chave com o vizinho, para os socorros entrarem.</li>
    <li>Tem um termómetro, analgésico habitual, soro oral e uma garrafa de água ao lado da cama.</li>
  </ul>
</section>""",
        """<section>
  <h2>Trabalhar e comunicar sem internet</h2>
  <ul>
    <li><b>Powerbank grande</b> (10 000 mAh ou mais), sempre carregado. Recarrega a cada 3 meses.</li>
    <li><b>Hotspot do telemóvel</b> como plano B para o computador. Tem o limite de dados em atenção.</li>
    <li>Descarrega mapas offline da tua zona e guarda ficheiros importantes em papel ou numa pen.</li>
    <li>Avisa o teu empregador ou clientes sobre o teu plano de contingência.</li>
    <li><b>Banca:</b> guarda numerário em casa (3 a 7 dias de despesas), cartões de mais de um banco e códigos em papel num sítio seguro.</li>
    <li>Muda palavras-passe com regularidade, ativa a autenticação em dois passos e <b>nunca</b> cliques em ligações recebidas por mensagem.</li>
  </ul>
</section>""",
        """<section>
  <h2>Mochila de evacuação (1 pessoa)</h2>
  <div class="grid2">
    <ul class="chk small">
      <li>Água (1 L) e comida de 24 h</li><li>Lanterna frontal e pilhas</li><li>Rádio pequeno</li><li>Powerbank + cabo</li><li>Medicamentos de 3 dias</li><li>Kit de primeiros socorros pequeno</li><li>Manta térmica</li>
    </ul>
    <ul class="chk small">
      <li>Documentos em saco impermeável</li><li>Numerário em notas pequenas</li><li>Roupa de reserva e impermeável</li><li>Apito, canivete, fita adesiva</li><li>Higiene básica</li><li>Cartão com contactos escritos</li><li>Carregador do telemóvel</li>
    </ul>
  </div>
  <div class="box"><p class="small" style="margin:0"><b>Se tens animal de estimação:</b> guarda comida e água para 7 dias, coleira com identificação e transportadora. Decide antes quem fica com ele se tiveres de sair.</p></div>
  <h3>Plano de saída</h3>
  <ol class="steps">
    <li>Sabe duas saídas e dois caminhos para fora do bairro.</li>
    <li>Ponto de encontro com a tua rede: ______________________</li>
    <li>Sai só quando mandarem ou se a casa estiver insegura. Fecha eletricidade, gás e água se for seguro.</li>
  </ol>
</section>""",
    ],
    "sheets": [CONTACTOS, INVENTARIO],
}

MULHER = {
    "id": "mulher-independente",
    "title": "Guia de preparação<br>para mulheres independentes",
    "lead": "Segurança pessoal e da casa, deslocações, comunicação e saúde, com atenção aos riscos específicos de quem vive só. Sem alarmismo, com um plano claro.",
    "who_short": "Mulheres independentes",
    "css": "",
    "estocar": estocar(
        1, "1 pessoa",
        extra_rows="<tr><td>Higiene íntima</td><td>Produtos menstruais para 2 ciclos, analgésico, sabão íntimo</td><td>Em crise, estes produtos faltam depressa.</td></tr>"
                   "<tr><td>Segurança pessoal</td><td>Apito, lanterna potente, alarme pessoal</td><td>Leve, sempre à mão ou na mala.</td></tr>",
        note="Inclui itens de saúde e segurança pessoal.",
    ),
    "chapters": [
        """<section>
  <h2>Segurança da casa</h2>
  <ul class="chk">
    <li><b>Portas:</b> fecho de segurança e olho mágico. Nunca abras a quem não esperavas ou não conheces. Fala pela porta.</li>
    <li><b>Janelas e varandas:</b> fechos funcionais. Em andares baixos, grades ou fechos extra.</li>
    <li><b>Luz exterior</b> com sensor de movimento ou luz de presença na entrada.</li>
    <li>Nome na caixa de correio e na campainha: usa apenas o apelido ou iniciais, sem indicar que vives sozinha.</li>
    <li>Em crise, não digas a desconhecidos que vives sozinha, nem quantos mantimentos tens.</li>
    <li>Conhece os teus vizinhos. Troca contactos e combina sinais: se bater na parede ou apitar, vêm ver.</li>
    <li>Tem um <b>quarto-refúgio</b> com porta resistente, telemóvel carregado e lanterna.</li>
    <li>Se sentires que não estás segura em casa, vai para casa de alguém de confiança.</li>
  </ul>
</section>""",
        """<section>
  <h2>Deslocações e comunicação</h2>
  <h3>Sair de casa em segurança</h3>
  <ul>
    <li>Diz a alguém para onde vais e a que horas voltas. <b>Partilha a localização</b> em tempo real com uma pessoa de confiança.</li>
    <li>Evita ruas pouco iluminadas e desertas. Prefere locais movimentados e com saída.</li>
    <li>Confia no teu instinto: se algo não parece bem, sai, muda de rua, entra numa loja, liga a alguém.</li>
    <li>Calçado confortável e roupa que permita andar depressa. Mantém uma mão livre.</li>
    <li>Leva o telemóvel carregado e um powerbank. Chaves na mão à chegada a casa.</li>
    <li>Quando conduzes em crise, enche o depósito cedo e evita estradas com apagões de iluminação.</li>
  </ul>
  <h3>Comunicação com a tua rede</h3>
  <ul>
    <li><b>Palavra-código</b> acordada com amigas ou família: se a disseres ao telefone, significa “preciso de ajuda, liga 112”.</li>
    <li>Combina um <b>check-in diário</b>. Se faltares, passam por tua casa.</li>
    <li>Guarda os números de emergência no ecrã de bloqueio do telemóvel.</li>
    <li>No Android e iPhone, ativa a função de <b>SOS de emergência</b> (botão lateral) e partilha a ficha médica.</li>
  </ul>
</section>""",
        """<section>
  <h2>Saúde e higiene em crise</h2>
  <ul class="chk">
    <li><b>Produtos menstruais:</b> guarda para dois ciclos. Em falta, usa pano limpo e lavável. Lava as mãos antes e depois.</li>
    <li><b>Contraceção e medicação habitual:</b> tem reserva de pelo menos 14 dias e cópia da receita.</li>
    <li><b>Infeções urinárias e saúde íntima:</b> bebe água, mantém a higiene e procura ajuda médica se tiveres sintomas.</li>
    <li><b>Gravidez ou suspeita:</b> tem os dados do teu médico e do hospital. Em caso de sangramento forte, dor intensa ou perda de líquido, liga <b>112</b>.</li>
    <li><b>Higiene com pouca água:</b> toalhitas, desinfetante, lavagem por partes. Água do banho a 1 L por pessoa para o essencial.</li>
    <li><b>Saúde mental:</b> rotina, sono, movimento, contacto com pessoas. Fala com alguém sobre o que sentes. Linha SNS 24: <b>808 24 24 24</b> (opção de saúde mental).</li>
  </ul>
</section>""",
        """<section>
  <h2>Apoio e linhas de ajuda</h2>
  <p class="small">Confirma os números nos sites oficiais. Em perigo imediato, liga sempre <b>112</b>.</p>
  <table>
    <tr><th>Serviço</th><th>Contacto</th></tr>
    <tr><td>Emergência</td><td><b>112</b></td></tr>
    <tr><td>Linha Nacional de Emergência Social (Segurança Social)</td><td><b>144</b></td></tr>
    <tr><td>Linha de informação a vítimas de violência doméstica (CIG)</td><td><b>800 202 148</b></td></tr>
    <tr><td>Apoio à Vítima (APAV)</td><td><b>116 006</b></td></tr>
    <tr><td>SNS 24</td><td><b>808 24 24 24</b></td></tr>
  </table>
  <div class="box alert">
    <p style="margin:0"><b>Se sofres violência ou te sentes ameaçada</b>, tens direito a ajuda, a proteção e a ser ouvida. Sai de casa se puderes, liga 112 ou uma das linhas acima e conta a uma pessoa de confiança. Não estás sozinha.</p>
  </div>
  <h3>Plano de saída rápido</h3>
  <ol class="steps">
    <li>Mochila pronta num sítio acessível: documentos, dinheiro, chaves de reserva, medicamentos, carregador, roupa.</li>
    <li>Um local seguro combinado (casa de alguém, local público).</li>
    <li>Ter sempre telemóvel carregado e dinheiro para transporte.</li>
    <li>Sai logo que sentires perigo. Os bens podem ser substituídos, tu não.</li>
  </ol>
</section>""",
    ],
    "sheets": [CONTACTOS, INVENTARIO],
}

CASAL = {
    "id": "casal",
    "title": "Guia de preparação<br>para casais",
    "lead": "Dois adultos, um plano comum. Como dividir tarefas, decidir juntos, estocar para dois e manter a calma e a relação quando tudo à volta é incerto.",
    "who_short": "Casais",
    "css": "",
    "estocar": estocar(
        2, "2 pessoas",
        extra_rows="<tr><td>Cuidar um do outro</td><td>Lista de medicação, alergias e contactos de ambos</td><td>Cada um conhece a saúde do outro.</td></tr>",
        note="Tudo duplicado, com cada pessoa a saber onde está.",
    ),
    "chapters": [
        """<section>
  <h2>Decidir em conjunto: papéis e plano a dois</h2>
  <p>Numa crise, o que mais desgasta um casal é a falta de acordo. <b>Combinem agora</b>, com calma, e escrevam.</p>
  <table>
    <tr><th>Tarefa</th><th>Responsável</th><th>Substituto</th></tr>
    <tr><td>Informação (rádio, notícias oficiais)</td><td class="line"></td><td class="line"></td></tr>
    <tr><td>Água e comida (inventário e racionamento)</td><td class="line"></td><td class="line"></td></tr>
    <tr><td>Primeiros socorros e medicação</td><td class="line"></td><td class="line"></td></tr>
    <tr><td>Comunicação com família e vizinhos</td><td class="line"></td><td class="line"></td></tr>
    <tr><td>Casa: gás, água, eletricidade, segurança</td><td class="line"></td><td class="line"></td></tr>
    <tr><td>Documentos e dinheiro</td><td class="line"></td><td class="line"></td></tr>
  </table>
  <ol class="steps">
    <li><b>Quem decide em emergência?</b> Acordem antes: em perigo físico, a pessoa que está mais perto da decisão age. Depois conversam.</li>
    <li><b>Palavra de pausa:</b> uma palavra que qualquer um diz para parar uma discussão 10 minutos e respirar.</li>
    <li><b>Duas pessoas, duas cópias:</b> cada um tem cópia dos contactos, documentos e plano.</li>
    <li><b>Revisão semestral a dois:</b> marquem no calendário e façam-na como um jantar de planeamento.</li>
  </ol>
</section>""",
        """<section>
  <h2>Separados durante a crise</h2>
  <p>Muitas vezes o casal não está junto quando acontece: trabalho, escola, transportes. <b>Plano antes de acontecer.</b></p>
  <ul class="chk">
    <li><b>Ponto de encontro 1:</b> casa. <b>Ponto 2:</b> um sítio fora do bairro, combinado.</li>
    <li>Esperem ao máximo <b>2 horas</b>: se não houver contacto, vão para o ponto 2 e avisam o contacto fora da zona.</li>
    <li><b>Contacto central:</b> uma pessoa de outra cidade a quem ambos ligam ou mandam mensagem a dizer “estou bem, estou em...”.</li>
    <li>Mochila no carro ou no trabalho, com água, comida, medicamentos, carregador e roupa.</li>
    <li>Partilhem a localização em tempo real durante a crise.</li>
    <li>SMS em vez de chamadas: usa menos rede. Mensagens curtas e claras.</li>
    <li>Se um dos dois tem de ficar em casa e o outro está fora, o que está em casa mantém a rede acordada e racionaliza recursos.</li>
  </ul>
</section>""",
        """<section>
  <h2>Cuidar da relação em crise</h2>
  <ul>
    <li><b>Sono e comida primeiro.</b> Cansaço e fome pioram qualquer discussão. Alternem turnos de vigília se for necessário.</li>
    <li><b>Falem uma vez por dia</b> sobre como cada um se sente, sem resolver nada. Só ouvir.</li>
    <li><b>Não culpem.</b> “Eu sinto” em vez de “tu fizeste”. Num momento difícil, o problema é a situação, não o outro.</li>
    <li><b>Dividam o medo:</b> tudo é mais leve a dois. Abracem-se, respirem juntos, tragam rotina a casa.</li>
    <li><b>Sinais de que alguém precisa de ajuda:</b> insónia prolongada, choro frequente, agressividade, isolamento. Procurem apoio no SNS 24 <b>808 24 24 24</b>.</li>
    <li>Se existe violência ou ameaça na relação, a segurança vem primeiro: liga 112 ou procura apoio (APAV 116 006).</li>
  </ul>
  <h3>Mochila de evacuação do casal</h3>
  <div class="grid2">
    <ul class="chk small">
      <li>Água (1 L cada) e comida de 24 h</li><li>2 lanternas frontais</li><li>Rádio e powerbank</li><li>Medicamentos de 3 dias de cada um</li><li>Kit de primeiros socorros</li><li>Manta térmica x2</li>
    </ul>
    <ul class="chk small">
      <li>Documentos de ambos em saco impermeável</li><li>Numerário em notas pequenas</li><li>Roupa de reserva x2</li><li>Higiene básica</li><li>Cartão com contactos escritos</li><li>Chaves de reserva</li>
    </ul>
  </div>
</section>""",
    ],
    "sheets": [CONTACTOS, INVENTARIO],
}

FAMILIA = {
    "id": "familia",
    "title": "Guia de preparação<br>para famílias",
    "lead": "O que fazer antes, durante e depois de um apagão, um ciberataque, uma calamidade ou uma falta de abastecimento. Para casas com 3 a 5 pessoas, incluindo crianças e bebés.",
    "who_short": "Famílias",
    "chapters": [FAMILIA_CRIANCAS, FAMILIA_EVAC],
    "estocar": estocar(4, "4 pessoas"),
    "css": "",
    "sheets": [],
}

FICHA_ANIMAL = """<section>
  <h2>Ficha do animal</h2>
  <p class="small">Preenche uma por animal. Guarda uma cópia na mochila e uma foto recente no telemóvel (de frente e de lado).</p>
  <table>
    <tr><th>Nome</th><td class="line"></td><th>Espécie / raça</th><td class="line"></td></tr>
    <tr><th>Idade</th><td class="line"></td><th>Peso</th><td class="line"></td></tr>
    <tr><th>Cor / sinais</th><td class="line"></td><th>N.º do microchip</th><td class="line"></td></tr>
    <tr><th>Vacinas até</th><td class="line"></td><th>Desparasitação</th><td class="line"></td></tr>
    <tr><th>Alergias</th><td class="line"></td><th>Medicação (dose e horas)</th><td class="line"></td></tr>
    <tr><th>Alimentação</th><td class="line"></td><th>Comportamento (medos, mordidelas)</th><td class="line"></td></tr>
  </table>
  <div class="grid2">
    <div class="box"><h3>Veterinário habitual</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Veterinário de urgência 24 h</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Quem fica com o animal se eu não puder</h3><div class="line"></div><div class="line"></div></div>
    <div class="box"><h3>Local alternativo que aceita animais</h3><div class="line"></div><div class="line"></div></div>
  </div>
</section>"""

PET = {
    "id": "pet",
    "title": "Guia de preparação<br>para o teu animal",
    "lead": "Cães, gatos e outros animais de companhia também sentem um apagão, uma calamidade ou uma evacuação. Como estocar para eles, como sair de casa com eles e como os manter calmos, seguros e identificados.",
    "who_short": "Animais de companhia",
    "css": "",
    "estocar": """<section>
  <h2>O que estocar para o animal</h2>
  <p>Reserva para <b>7 a 14 dias</b> (num apagão curto bastam 3, mas o abastecimento pode falhar mais tempo). Valores base para um cão ou gato adulto; ajusta ao peso e ao veterinário.</p>
  <table>
    <tr><th>Categoria</th><th>Quantidade (por animal)</th><th>Notas</th></tr>
    <tr><td>Água</td><td>Cerca de 50 ml por kg e por dia (cães e gatos)</td><td>Mais com calor, ração seca ou lactação. Contas à parte da água das pessoas. Renova a cada 6 meses.</td></tr>
    <tr><td>Comida</td><td>7 a 14 dias da dieta habitual</td><td>Troca por entradas novas e usa as antigas primeiro. Mudar de comida de repente causa diarreia: guarda a que ele já come.</td></tr>
    <tr><td>Recipientes</td><td>Taça de água e de comida, dobráveis</td><td>Abre-latas manual se for comida húmida.</td></tr>
    <tr><td>Medicação</td><td>14 dias, com dose e horas escritas</td><td>Fala com o veterinário sobre uma reserva. Nunca dês medicamentos humanos.</td></tr>
    <tr><td>Higiene</td><td>Sacos para dejetos, areia do gato, toalhitas, toalha</td><td>Areia para 7 dias e recipiente com tampa.</td></tr>
    <tr><td>Transporte</td><td>Caixa de transporte ou arnês + trela curta</td><td>Cães e gatos devem estar habituados à caixa <b>antes</b>.</td></tr>
    <tr><td>Identificação</td><td>Coleira com nome e telefone, microchip atualizado</td><td>Verifica que os teus dados no microchip estão certos.</td></tr>
    <tr><td>Conforto</td><td>Manta, brinquedo ou peça com o teu cheiro</td><td>Ajuda a baixar o stress.</td></tr>
    <tr><td>Documentos</td><td>Boletim de vacinas, ficha do animal, foto recente</td><td>Cópias em saco impermeável e no telemóvel.</td></tr>
  </table>
</section>""",
    "chapters": [
        """<section>
  <h2>Proteger o animal em casa</h2>
  <ul class="chk">
    <li><b>Identificação sempre:</b> coleira com nome e telefone, mais o microchip registado com o teu contacto atual.</li>
    <li><b>Casa segura:</b> portas e janelas fechadas, o animal junto de ti. Em stress, cães e gatos fogem.</li>
    <li><b>Calor sem eletricidade:</b> sem ventilador nem ar condicionado, dá água fresca, sombra e um pano húmido. <b>Nunca</b> o deixes no carro parado.</li>
    <li><b>Frio:</b> manta, cama longe do chão e abrigo sem correntes de ar.</li>
    <li><b>Ruído, sirenes e trovoada:</b> um canto tranquilo, voz calma, brinquedo ou petisco. Não castigues o medo.</li>
    <li><b>Comida e água em lugar fixo:</b> a rotina tranquiliza.</li>
    <li><b>Velas e fogareiros:</b> fora do alcance do animal. Cuidado com cabos, pilhas e produtos de limpeza.</li>
    <li><b>Alimentos perigosos:</b> chocolate, uvas e passas, cebola, alho, xilitol (adoçante) e ossos cozinhados. Fecha o lixo.</li>
  </ul>
  <div class="box"><h3>Sinais de que precisa de veterinário</h3>
    <p style="margin:0">Vómitos ou diarreia repetidos, não beber, respiração ofegante e muito rápida, gengivas pálidas, apatia, convulsões, barriga inchada, tentar urinar sem conseguir (sobretudo gatos machos). Liga ao veterinário de urgência; se não conseguires, vai ou pede ajuda.</p></div>
</section>""",
        """<section>
  <h2>Mochila do animal e primeiros socorros</h2>
  <div class="grid2">
    <ul class="chk small">
      <li>Comida e água para 3 dias</li><li>Taças dobráveis</li><li>Medicação e dose escritas</li><li>Trela, arnês e coleira de reserva</li><li>Caixa de transporte</li><li>Manta e brinquedo</li>
    </ul>
    <ul class="chk small">
      <li>Boletim de vacinas e ficha do animal</li><li>Foto recente (e cópia impressa)</li><li>Sacos de dejetos, areia, toalhitas</li><li>Cartão com contactos do veterinário</li><li>Focinheira (cães), toalha para envolver (gatos)</li><li>Kit de primeiros socorros</li>
    </ul>
  </div>
  <h3>Kit de primeiros socorros do animal</h3>
  <ul>
    <li>Compressas e ligadura autoadesiva (não a aperta demasiado)</li>
    <li>Soro fisiológico para lavar feridas e olhos</li>
    <li>Pinça, tesoura de pontas redondas e termómetro de uso veterinário</li>
    <li>Luvas descartáveis e uma toalha limpa</li>
    <li>Número do veterinário e o do centro antivenenos veterinário, se existir na tua zona</li>
  </ul>
  <div class="box alert"><p style="margin:0"><b>Não dês medicamentos humanos</b> (paracetamol, ibuprofeno) a cães ou gatos: podem ser fatais. Em caso de dúvida, fala com um veterinário.</p></div>
</section>""",
        """<section>
  <h2>Evacuar com o animal</h2>
  <p><b>Se tens de sair, ele vai contigo.</b> Deixar um animal para trás ou preso põe-no em risco.</p>
  <ol class="steps">
    <li><b>Planeia antes.</b> Descobre agora onde podes ficar com ele: familiares, amigos, hotéis, alojamentos locais ou parques de campismo que aceitem animais. Muitos abrigos de emergência não aceitam, por isso confirma.</li>
    <li><b>Caixa ou trela, sempre.</b> Gatos e animais pequenos na caixa, fechada. Cães com trela curta e arnês bem ajustado.</li>
    <li><b>Mantém a calma.</b> O animal sente a tua tensão. Fala devagar, sem gritar.</li>
    <li><b>No carro:</b> caixa presa ou arnês de segurança. Não o deixes sozinho dentro do carro, mesmo por pouco tempo. Pára para água e para fazer as necessidades.</li>
    <li><b>Se te separares do animal:</b> avisa as autoridades e o veterinário, mostra a foto e o número do microchip, e deixa o teu contacto.</li>
  </ol>
  <h3>Ensaia uma vez por ano</h3>
  <p>Treina a entrada na caixa, o arnês e o carro. Um animal habituado fica muito mais calmo no dia em que for a sério.</p>
</section>""",
        """<section>
  <h2>Outros animais de casa</h2>
  <table>
    <tr><th>Animal</th><th>O essencial</th></tr>
    <tr><td>Aves</td><td>Transportadora pequena, tapada com um pano para acalmar. Água e semente para 7 dias. Longe de fumos, velas e correntes de ar. Sensíveis ao frio.</td></tr>
    <tr><td>Coelhos e roedores</td><td>Transportadora com feno e esconderijo. Água fresca sempre, sem calor extremo. Feno e ração para 14 dias.</td></tr>
    <tr><td>Peixes</td><td>Sem eletricidade o oxigénio acaba. Bomba de ar a pilhas ou manual e baldes de água do aquário. Não alimentes em excesso.</td></tr>
    <tr><td>Répteis</td><td>Dependem de calor: manta térmica, caixa isolada e fonte de calor segura. Fala com o teu veterinário de exóticos.</td></tr>
  </table>
</section>""",
    ],
    "sheets": [FICHA_ANIMAL, CONTACTOS, INVENTARIO],
}

PROFILES = [IDOSO, SOZINHO, MULHER, CASAL, PET]


def cover(title, lead, tag="Guia para imprimir · PDF"):
    return f"""<section class="cover">
  <div>
    <span class="tag">{tag}</span>
    <h1 style="margin-top:22mm">{title}</h1>
    <p class="lead">{lead}</p>
  </div>
  <div>
    <div class="box">
      <p class="big" style="margin:0">Como usar este guia</p>
      <ol>
        <li><b>Imprime-o hoje.</b> Se faltar a luz ou a internet, o papel continua a funcionar.</li>
        <li><b>Preenche as folhas finais</b> (contactos, plano, inventário) à mão, com caneta.</li>
        <li><b>Guarda-o</b> numa pasta ou bolsa à vista, junto da lanterna. Quem vive contigo deve saber onde está.</li>
        <li><b>Revê-o de 6 em 6 meses.</b> Renova água, comida e medicamentos.</li>
      </ol>
    </div>
    <p class="small">Este guia é informação geral de preparação e não substitui formação em primeiros socorros nem as ordens das autoridades. Em caso de perigo imediato, liga <b>112</b>. Segue sempre as indicações da Proteção Civil e das forças de segurança.</p>
    <p class="small"><b>Arkorra</b> · arkorra.myshopify.com</p>
  </div>
</section>"""


def page(title, body, footer, extra_css=""):
    css = (HERE / "guide.css").read_text()
    return f"""<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><title>{re.sub('<br>',' ',title)} — Arkorra</title>
<style>
{css}
{extra_css}
@page {{ @bottom-left {{ content: "{footer}"; font: 9pt Arial, sans-serif; }} }}
</style></head><body>
{body}
</body></html>
"""


def write_pdf(html_path):
    pdf = html_path.with_suffix(".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={pdf}", f"file://{html_path}"],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    return pdf


def build_profile(p):
    chapters = [COMMON_TELEFONES, COMMON_CENARIOS, p["estocar"], COMMON_MATERIAIS] + p["chapters"] + p["sheets"]
    body = cover(p["title"], p["lead"]) + "\n".join(h2_renumber(chapters))
    title = re.sub("<br>", " ", p["title"])
    html = page(p["title"], body, f"Arkorra · {title}", p["css"])
    path = HERE / f"guia-{p['id']}.html"
    path.write_text(html)
    return write_pdf(path)


def build_completo():
    """All profiles in one PDF: common core, then one part per profile."""
    parts = []
    parts.append(COMMON_TELEFONES)
    parts.append(COMMON_CENARIOS)
    parts.append(f"""<section>
  <h2>O que estocar (1, 2 e 4 pessoas)</h2>
  <p>Valores base para <b>72 horas</b>. Multiplica por 2 ou 3 para 7 a 14 dias.</p>
  <table>
    <tr><th>Categoria</th><th>1 pessoa</th><th>2 pessoas</th><th>4 pessoas</th></tr>
    <tr><td>Água (3 L por pessoa e por dia)</td><td>9 L</td><td>18 L</td><td>36 L</td></tr>
    <tr><td>Comida não perecível</td><td>3 dias</td><td>3 dias</td><td>3 dias</td></tr>
    <tr><td>Lanternas ou frontais</td><td>2</td><td>2–3</td><td>4</td></tr>
    <tr><td>Rádio de pilhas ou manivela</td><td>1</td><td>1</td><td>1</td></tr>
    <tr><td>Powerbank carregado</td><td>1</td><td>2</td><td>2–3</td></tr>
    <tr><td>Kit de primeiros socorros</td><td>1</td><td>1</td><td>1</td></tr>
    <tr><td>Medicamentos habituais</td><td>7–14 dias</td><td>7–14 dias</td><td>7–14 dias</td></tr>
    <tr><td>Mantas e manta térmica</td><td>1</td><td>2</td><td>4</td></tr>
    <tr><td>Fogareiro + cartuchos</td><td>1</td><td>1</td><td>1–2</td></tr>
    <tr><td>Numerário (3 a 7 dias de despesas)</td><td>✓</td><td>✓</td><td>✓</td></tr>
  </table>
  <p>Também: higiene (papel higiénico, toalhitas, sabão, sacos do lixo), cópias dos documentos em saco impermeável, canivete, fita adesiva, apito e luvas.</p>
</section>""")
    parts.append(COMMON_MATERIAIS)
    for p in [IDOSO, FAMILIA, SOZINHO, MULHER, CASAL, PET]:
        intro = f"""<section>
  <h2>Perfil: {p['who_short']}</h2>
  <p class="lead" style="font-size:14pt">{p['lead']}</p>
  <div class="box"><p style="margin:0" class="small">Nas páginas seguintes: os capítulos específicos para este perfil.</p></div>
</section>"""
        parts.append(intro)
        parts.extend(p["chapters"])
    parts += [CONTACTOS, MEDICACAO, INVENTARIO]
    body = cover("Guia completo<br>de preparação",
                 "Todos os guias num só: idosos, famílias, quem vive sozinho, mulheres independentes, casais e animais de companhia. O que estocar, como usar cada material, como te proteger e o que fazer antes, durante e depois de uma emergência.",
                 "Guia completo · PDF para imprimir") + "\n".join(h2_renumber(parts))
    html = page("Guia completo de preparação", body, "Arkorra · Guia completo de preparação")
    path = HERE / "guia-completo.html"
    path.write_text(html)
    return write_pdf(path)


if __name__ == "__main__":
    for p in PROFILES:
        print(build_profile(p))
    print(build_completo())
