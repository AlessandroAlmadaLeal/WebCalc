"use strict";

var exibindoResultado = false;
var contaParenteses = 0;

document.addEventListener('DOMContentLoaded', function() {
    var botoes = document.querySelectorAll('button');
    botoes.forEach(button => {
    button.addEventListener('click', () => {
        var botao = button;
        var botaoClasse = button.classList.value;
        switch (botaoClasse) {
            case 'a':
                if(botao.textContent == '%'){
                    percentual();
                } else {
                    inserir(botaoValor);
                }
            break;
            case 'n':
                if(botao.textContent == '.'){
                    virgula();
                } else {
                    inserir(botao);
                }
            break;
            case 'o':
                inserir(botao);
            break;
            case 'z':
                inserir(botao);
            break;
            case 'c':
                if(botao.textContent == 'CC'){
                    limparTela();
                } else {
                    limparDigito();
                }
            break;
            case 'eq':
                calcular();
            break;
            default:
                console.log('Erro');
            break;
        }
    });
    });
});

function controleTela(argumento) {
    if (argumento == true) {
        exibindoResultado = true;
    } else {
        exibindoResultado = false;
    }
    return (exibindoResultado);
}

function controlarParenteses(argumento) {
    if (argumento == true) {
        contaParenteses += 1;
    } else if (argumento == false) {
        contaParenteses -= 1;
    } else {
        contaParenteses = 0;
    }
    return (contaParenteses);
}

function manipularTela(argumento1, argumento2) {
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

function consultarElementos(argumento) {
    switch (argumento) {
        case 'c':
            var elementos = substituirElementos(manipularTela('R', '1'));
            return elementos.length;
        case 'u':
            var ultimoElemento = substituirElementos(manipularTela('R', '1')).at(-1);
            return ultimoElemento;
    }
}

function inserir(digito) {
    var ultimoElemento = consultarElementos('u');
    var qtdElementos = consultarElementos('c');
    var tecla = digito.textContent;

    if (!operador(tecla)) {
        if (exibindoResultado) {
            limparTela();
        }
        if (tecla === '(') {
            controlarParenteses(true);
            manipularTela('W', tecla);
        } else if (tecla === ')' && 
                   contaParenteses > 0 && 
                   ultimoElemento !== '(') {
            controlarParenteses(false);
            manipularTela('W', tecla);
        } else if (tecla !== '(' && tecla !== ')'){
            manipularTela('W', tecla);
        } else {
            return;
        }
    } else {
        if (qtdElementos === 0 && operador(tecla)) {
            return;
        }
        if (exibindoResultado) {
            limparTela();
        }
        if (operador(tecla) && !operador(ultimoElemento)) {
            manipularTela('WO', tecla);
        } else if (operador(tecla) && operador(ultimoElemento)) {
            limparDigito();
            manipularTela('WO', tecla);
        } else {
            limparTela();
            manipularTela('W', tecla);
        }
    }
}

function percentual() {
    if (manipularTela('R', '2') == 0 ||
        consultarElementos('c') > 1  ||
        operador(manipularTela('R', '0'))) {
        return;
    }
    var auxiliar = manipularTela('R', '0') / 100;
    manipularTela('WR', auxiliar);
    manipularTela('WO', 'x');
    return toString(auxiliar) + ' x ';
}

function virgula() {
    var ultimoElemento = consultarElementos('u');
    var qtdElementos = consultarElementos('c');
    if (qtdElementos == 0           ||
        operador(ultimoElemento)    ||
        ultimoElemento =='(') {
        manipularTela('W', '0.');
    } else if (!possuiVirgula(ultimoElemento)) {
        manipularTela('W', '.');
    } else {
        return;
    }
}

function possuiVirgula(argumento) {
    var padraoRegEx = /^\d+\.$/;
    if (!isNaN(argumento)) {
        if (parseInt(argumento) != parseFloat(argumento) ||
            padraoRegEx.test(argumento)) {
            return true;
        }
    }
    return false;
}

function truncarNumero(numero) {
    if(isNaN(numero)   || 
        numero == true  ||
        numero == false ||
        numero == null  ||
        numero == undefined){
        return NaN;
    }
    var casasDecimais = 4;
    var fatorDeMultiplicacao = 10 ** casasDecimais;
    var numeroTruncado = parseInt(numero * fatorDeMultiplicacao) / fatorDeMultiplicacao;
    return Number(numeroTruncado.toFixed(casasDecimais));
}

function mascara(argumento) {
    if (possuiVirgula(argumento) || argumento >999) {
        var opcoes = {
            style: 'decimal',
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        };
        return argumento.toLocaleString('en-US', opcoes);
    } else {
        return argumento;
    }
}

function limparTela() {
    manipularTela('W', '');
    controlarParenteses();
    controleTela(false);
}

function limparDigito() {
    if (exibindoResultado == true) {
        return;
    } else {
        var elemento = consultarElementos('u');
        if (manipularTela('R', '0') == '') {
            manipularTela('W', '');
        } else {
            if (operador(elemento)) {
                manipularTela('DO');
            } else if (elemento == '(' ){
                manipularTela('DD');
                controlarParenteses(false);
            } else if (elemento == ')'){
                manipularTela('DD');
                controlarParenteses(true);
            } else 
                manipularTela('DD');
        }
    }
}

function operador(elemento) {
    if (elemento == null) {
        return false;
    } else if (elemento.toString().slice(-3).replace(/\s/g, '') == '+' ||
        elemento.toString().slice(-3).replace(/\s/g, '') == '-' ||
        elemento.toString().slice(-3).replace(/\s/g, '') == 'x' ||
        elemento.toString().slice(-3).replace(/\s/g, '') == '/' ||
        elemento.toString().slice(-3).replace(/\s/g, '') == '^' ) {
        return true;
    } else {
        return false;
    }
}

function pmdas(precedente) {
    if (precedente == ';') {
        return 1;
    } else if (precedente == '+' ||
               precedente == '-') {
        return 2;
    } else if (precedente == '/' ||
               precedente == 'x') {
        return 3;
    } else if (precedente == '^') {
        return 4;
    } else
        return 0;
}

function substituirElementos(string) {
    return string.replace(/\s*([+\-x^()/])\s*/g, ',$1,').split(',').filter(element => element.trim() !== '');
}

function parseNPR(expressaoInfixa) {
    var posfixo = [];
    var pilha = [];
    var numeroAtual = "";
    for (var i = 0; i < expressaoInfixa.length; i++) {
        var elemento = expressaoInfixa[i];
        if (elemento === " ") {
            continue;
        }
        if (operador(elemento)) {
            if (numeroAtual !== "") {
                posfixo.push(numeroAtual);
                numeroAtual = "";
            }
            while (
                pilha.length > 0 &&
                operador(pilha[pilha.length - 1]) &&
                pmdas(elemento) <= pmdas(pilha[pilha.length - 1])
            ) {
                posfixo.push(pilha.pop());
            }
            pilha.push(elemento);
        } else if (elemento === "(") {
            if (numeroAtual !== "") {
                posfixo.push(numeroAtual);
                numeroAtual = "";
            }
            pilha.push(elemento);
        } else if (elemento === ")") {
            if (numeroAtual !== "") {
                posfixo.push(numeroAtual);
                numeroAtual = "";
            }
            while (pilha.length > 0 && pilha[pilha.length - 1] !== "(") {
                posfixo.push(pilha.pop());
            }
            if (pilha.length === 0) {
                limparTela();
                throw new Error("Expressão inválida: parênteses não correspondentes.");
            }
            pilha.pop();
        } else {
            numeroAtual += elemento;
        }
    }
    if (numeroAtual !== "") {
        posfixo.push(numeroAtual);
    }
    while (pilha.length > 0) {
        if (pilha[pilha.length - 1] === "(" || pilha[pilha.length - 1] === ")") {
            limparTela();
            throw new Error("Expressão inválida: parênteses não correspondentes.");
        }
        posfixo.push(pilha.pop());
    }
    return posfixo;
}

function validarEntrada(expressao) {
    const regex = /^[0-9()+\-\x\/\^\%\s.=]+$/;
    return regex.test(expressao);
}

function calcular() {
    var pilhaInicial = manipularTela('R',"1");
    var pilhaOperacao = parseNPR(pilhaInicial);
    var pilhaExec = [];
    var memoria = 0.0;
    var direita = 0.0;
    var esquerda = 0.0;
    var i = 0;
    var j = 0;
    var k = 0;
    if (pilhaInicial == null) {
        limparTela();
        return;
    }
    if (!validarEntrada(pilhaInicial)) {
        limparTela();
        alert("Por gentileza, evite injetar caracteres estranhos ai!");
        return;
    }
    if (exibindoResultado == true) {
        return;
    } else {
        for (i = 0; i < pilhaOperacao.length; i++) {
            pilhaExec.push(pilhaOperacao[i]);
            k = pilhaExec.length - 1;
            direita = parseFloat(pilhaExec[j - 1]);
            esquerda = parseFloat(pilhaExec[j - 2]);
            if (isNaN(pilhaOperacao[i])) {
                switch (pilhaOperacao[i]) {
                    case '+':
                        memoria = truncarNumero(esquerda + direita);
                        while (j != k - 3) {
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                        break;
                    case '-':
                        memoria = truncarNumero(esquerda - direita);
                        while (j != k - 3) {
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                        break;
                    case 'x':
                        memoria = truncarNumero(esquerda * direita);
                        while (j != k - 3) {
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                        break;
                    case '/':
                        memoria = truncarNumero(esquerda / direita);
                        while (j != k - 3) {
                            pilhaExec.pop();
                            j -= 1;
                        }
                        pilhaExec.push(memoria.toString());
                        j += 2;
                        break;
                    case '^':
                        memoria = truncarNumero(esquerda ** direita);
                        while (j != k - 3) {
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
        manipularTela('WR', manipularTela('R', '1') + " = " + "\n" + mascara(memoria));
        controleTela(true);
    }
}

/* Descomentar depois para rodar os testes!
module.exports = {
    exibindoResultado,
    contaParenteses,
    controleTela,
    controlarParenteses,
    manipularTela,
    consultarElementos, 
    inserir,
    percentual,
    virgula,
    possuiVirgula,
    truncarNumero,
    mascara,
    limparTela, 
    limparDigito,
    operador, 
    pmdas, 
    substituirElementos, 
    parseNPR,
    calcular
}; */
