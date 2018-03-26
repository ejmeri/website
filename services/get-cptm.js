{/*  <a id="situacao-linhas" href="#situacao-linhas" style="visibility:hidden">S</a>
19:33:27 web.1   |                    <!-- Situacao das linhas -->
19:33:27 web.1   |                    <div class="col-sm-12 col-md-8 situacao_linhas">
19:33:27 web.1   |                       <div class='col-md-12 '><h5>Situação das linhas​​​​</h5><div class='col-xs-4 col-sm-4 col-md-2 rubi'><span class='nome_linha'>RUBI</span><span data-placement='bottom' title=''  data-original-title='Por motivo de Serviços Programados , os trens da Linha 7 - Rubi estão circulando com intervalos maiores entre as Estações Luz e Francisco Morato .'   class='status_reduzida'>Velocidade Reduzida</span></div><div class='col-xs-4 col-sm-4 col-md-2 diamante'><span class='nome_linha'>D
19:33:27 web.1   |  >  IAMANTE</span><span data-placement='bottom' title=''  data-original-title='Por motivo de Serviços Programados , os trens da Linha 8 - Diamante estão circulando com intervalos maiores entre as Estações Barueri e Itapevi .'   class='status_reduzida'>Velocidade Reduzida</span></div><div class='col-xs-4 col-sm-4 col-md-2 esmeralda'><span class='nome_linha'>ESMERALDA</span><span data-placement='bottom' title=''   class='status_normal'>Operação Normal</span></div><div class='col-xs-4 col-sm-4 col-md-2
19:33:27 web.1   |  >   turquesa'><span class='nome_linha'>TURQUESA</span><span data-placement='bottom' title=''   class='status_normal'>Operação Normal</span></div><div class='col-xs-4 col-sm-4 col-md-2 coral'><span class='nome_linha'>CORAL</span><span data-placement='bottom' title=''   class='status_normal'>Operação Normal</span></div><div class='col-xs-4 col-sm-4 col-md-2 safira'><span class='nome_linha'>SAFIRA</span><span data-placement='bottom' title=''  data-original-title='Por motivo de Obras de Modernização ,
19:33:27 web.1   |  >  os trens da Linha 12 - Safira estão circulando com intervalos maiores entre as Estações Brás e Calmon Viana .'   class='status_reduzida'>Velocidade Reduzida</span></div><div class='ultima_atualizacao'>| Atualizado em: 18/03/2018 19:33</div></div> */}

'use scrict';

const got = require('got');
var request = require('request');

function RetornaText(params) {
   
}

module.exports = () => {
    const apiUrl =
      'http://www.cptm.sp.gov.br/Pages/Home.aspx'
    
    return got(apiUrl).then(({ err, body }) => {
        
        if (body) {

            const begin = body.indexOf('<a id="situacao-linhas" href="#situacao-linhas" style="visibility:hidden">S</a>');
            const end = body.indexOf('<!-- Noticias -->');
            const str = body.substring(begin, end);
            
            var text = str.replace('<!-- Situacao das linhas -->', '');
            var rex = /(<([^>]+)>)/ig ;
            text = text.replace(rex , "\n");
            text = text.replace('S', '');
        
            return text;
        }
    
      throw new TypeError('Please, try again in a few minutes')
    })
  }