
var exibindoResultado = false;  

function controleTela(argumento){
    if (argumento == true){
        exibindoResultado = true;
    } else {
        exibindoResultado = false;
    }
    return(exibindoResultado);
}

function manipularTela(argumento1, argumento2){
    var objetoTela = document.getElementById('tela');
    var valorDaTela, stringDaTela, tamanho;
    switch (argumento1) {
        case 'R':
            valorDaTela = objetoTela.value; 
            stringDaTela = valorDaTela.toString();
            tamanho = valorDaTela.length;
            return [valorDaTela, stringDaTela, tamanho][argumento2];
        case 'W': 
            if (argumento2 == '') {
                objetoTela.value = '';
            } else {
                objetoTela.value += argumento2;
            }
            break;
        case 'WO': 
            objetoTela.value += ' ' + argumento2 + ' ';
            break;
        case 'WR':
            objetoTela.value = argumento2;
            break;
        case 'DD': 
            valorDaTela = objetoTela.value;
            tamanho = valorDaTela.length;
            objetoTela.value = valorDaTela.substring(0, tamanho - 1);
            break;
        case 'DO': 
            valorDaTela = objetoTela.value;
            tamanho = valorDaTela.length;
            objetoTela.value = valorDaTela.substring(0, tamanho - 3);
            break;
        default:
            throw new Error(`Sinal operação inválida: ${argumento1}`);
    }  
}

function inserir(digito) {
    var tecla = digito.textContent;  
    if (exibindoResultado == true){
        limparTela();
    } 
    if (manipularTela('R','0') == '0' || 
        manipularTela('R','0') == 'Syntax error') {        
        manipularTela('W','0');
    } else {        
        if (operador(tecla)) {
            if (operador(manipularTela('R','0'))){                    
                limparDigito(); 
                manipularTela('WO',tecla);
            } else if (manipularTela('R','2') < 1) {    
                return;
            } else {               
                manipularTela('WO',tecla);
            }
        } else {
            manipularTela('W',tecla);
        }
    }
}

function limparTela() {
    manipularTela('W','');
    controleTela(false);
}

function limparDigito() {    
    if (exibindoResultado == true){ 
        return;
    } else{
        if(manipularTela('R','0') == '') {
            manipularTela('W','');
        } else {
            if (operador(manipularTela('R','0'))){     
                manipularTela('DO');
            } else {
                manipularTela('DD');
            }
        }
    }
}

function operador(elemento) {
    if(elemento == null){
        return false;
    }else if (elemento.toString().slice(-3).replace(/\s/g, '') == '+' || 
              elemento.toString().slice(-3).replace(/\s/g, '') == '-' ||
              elemento.toString().slice(-3).replace(/\s/g, '') == 'x' || 
              elemento.toString().slice(-3).replace(/\s/g, '') == '/'  ) {
        return true;
    }else {
        return false;
    }
}

function mdas(precedente) {    
    if (precedente == ';') {
        return 1;
    }else if (precedente == '+' || 
              precedente == '-') {
        return 2;
    }else if (precedente == '/' ||
              precedente == 'x') {
        return 3;
    }else
        return 0;
}

function substituir(string) {
    return string.replace(/\s*([+\-x/])\s*/g, ',$1,').split(',').filter(element => element.trim() !== '');
}

function parseNPR(exprecaoInfixa) {
    var posfixo = [];
    var aux = [];
    for (var i = 0; i < exprecaoInfixa.length; i++) {
        if (operador(exprecaoInfixa[i])) {       
            if (mdas(exprecaoInfixa[i]) > mdas(aux[aux.length - 1])) {              
                aux.push(exprecaoInfixa[i]);
            }
            else {  
                while (mdas(exprecaoInfixa[i]) <= 
                       mdas(aux[aux.length - 1]) && 
                       aux.length > - 1) {
                    posfixo.push(aux.pop());
                }           
                aux.push(exprecaoInfixa[i]);
            }
        }
        else { 
            posfixo.push(exprecaoInfixa[i]);
        }
    }
    while (aux.length - 1 != - 1) {
       posfixo.push(aux.pop());
    }
    return posfixo; 
}

function calcular() {
    if (operador(manipularTela('R','0'))){
        limparDigito();
    }
    var pilhaOperacao = parseNPR(substituir(manipularTela('R','1')));
    var pilhaExec = [];
    var memoria = 0.0;
    var direita = 0.0;
    var esquerda = 0.0;
    var i = 0;
    var j = 0;
    var k = 0;    
    if (exibindoResultado == true) {
        return;
    } else {    
        for (i = 0; i < pilhaOperacao.length; i++) {
            pilhaExec.push(pilhaOperacao[i]);
            k = pilhaExec.length - 1;       
            direita = parseFloat(pilhaExec[j-1]); 
            esquerda = parseFloat(pilhaExec[j-2]);         
            if (isNaN(pilhaOperacao[i])) {
                switch (pilhaOperacao[i]) { 
                    case '+': 
                        memoria = esquerda + direita;
                        while (j != k - 3){
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                    break;
                    case '-': 
                        memoria = esquerda - direita;
                        while (j != k - 3){
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                    break;
                    case 'x': 
                        memoria = esquerda * direita;
                        while (j != k - 3){
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                    break;
                    case '/': 
                        memoria = esquerda / direita;
                        while (j != k - 3){
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                    break;
                    default:
                        throw new Error(`Sinal de operação inválido: ${pilhaOperacao[i]}`);
                }  
            } else {
                j += 1;
                continue;
            }
        }        
        manipularTela('WR', manipularTela('R','1') + " = " + "\n" + memoria); 
        controleTela(true);
    }
}

module.exports = {
    exibindoResultado,
    controleTela,
    manipularTela, 
    inserir, 
    limparTela, 
    limparDigito,
    operador, 
    mdas, 
    substituir, 
    parseNPR, 
    calcular
};
