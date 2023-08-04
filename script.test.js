
const {
  exibindoResultado,
  contaParenteses,
  controleTela,
  controlarParenteses,
  manipularTela,
  consultarElementos, 
  inserir,
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
} = require('./script.js');

describe('\nTESTE DA FUNÇÃO | controleTela:', () => {
  test('Deve manipular a variável global exibindoResultado.', () => {
    expect(controleTela(true)).toBe(true);
    expect(controleTela(false)).toBe(false);
  });
});

describe ('\nTESTE DA FUNÇÃO | controlarParenteses:', () => {
  test('Deve manipular a variável global contaParenteses.', () => {
    expect(controlarParenteses(true)).toEqual(1);
    expect(controlarParenteses(false)).toEqual(0);
    expect(controlarParenteses(true)).toEqual(1);
    expect(controlarParenteses(true)).toEqual(2);
    expect(controlarParenteses(null)).toEqual(0);
  });
});

describe('\nTESTE DA FUNÇÃO | manipularTela:', () => {
  beforeEach(() => {
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Deve retornar valor, texto e tamanho dos elementos presentes na tela', () => {
    document.getElementById('tela').value = '';
    expect(manipularTela('R', 0)).toBe('');
    expect(manipularTela('R', 1)).toBe('');
    expect(manipularTela('R', 2)).toBe(0);
    document.getElementById('tela').value = '2 + 2';
    expect(manipularTela('R', 0)).toBe("2 + 2");
    expect(manipularTela('R', 1)).toBe('2 + 2');
    expect(manipularTela('R', 2)).toBe(5);
  });

  test('Deve inserir um número na tela e adicionar outro na sequência', () => {
    document.getElementById('tela').value = '';
    manipularTela('W', '4');
    expect(document.getElementById('tela').value).toBe('4');
    manipularTela('W', '5');
    expect(document.getElementById('tela').value).toBe('45');
  });

  test('Deve escrever um operador na tela.', () => {
    document.getElementById('tela').value = '4';
    manipularTela('WO', '+');
    expect(document.getElementById('tela').value).toBe('4 + ');
    document.getElementById('tela').value = '4';
    manipularTela('WO', '-');
    expect(document.getElementById('tela').value).toBe('4 - ');
    document.getElementById('tela').value = '4';
    manipularTela('WO', 'x');
    expect(document.getElementById('tela').value).toBe('4 x ');
    document.getElementById('tela').value = '4';
    manipularTela('WO', '/');
    expect(document.getElementById('tela').value).toBe('4 / ');
  });

  test('Deve escrever um resultado na tela.', () => {
    document.getElementById('tela').value = '';
    manipularTela('WR', '2 + 2 = 4');
    expect(document.getElementById('tela').value).toBe('2 + 2 = 4');
  });

  test('Deve remover um digito da tela', () => {
    document.getElementById('tela').value = '123';
    manipularTela('DD');
    expect(document.getElementById('tela').value).toBe('12');
  });

  test('Deve remover um operador da tela junto com os espaços.', () => {
    document.getElementById('tela').value = '12 + ';
    manipularTela('DO');
    expect(document.getElementById('tela').value).toBe('12');
  });

  test('Lança um erro para um sinal de operação inválido', () => {
    expect(() => manipularTela('Z')).toThrowError('Sinal operação inválida: Z');
  });
});

describe('\nTESTE DA FUNÇÃO | consultarElementos:', () => {
  beforeEach(() => {
    // Configuração inicial
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Deve retornar o tamanho da lista de elementos quando o argumento for "c"', () => {
    document.getElementById('tela').value = 1234;
    expect(consultarElementos('c')).toBe(1);
    document.getElementById('tela').value = "123 + 12";
    expect(consultarElementos('c')).toBe(3);
  });

  test('Deve retornar o último elemento da lista quando o argumento for "u"', () => {
    document.getElementById('tela').value = 1234;
    expect(consultarElementos('u')).toBe('1234');
    document.getElementById('tela').value = "123 + 12";
    expect(consultarElementos('u')).toBe('12');
  });
});

describe('\nTESTE DA FUNÇÃO | inserir:', () => {
  beforeEach(() => {
    // Configuração inicial
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Não é permitido inserir operador como primeiro digito.', () => {
    document.getElementById('tela').value = '';
    const digito = document.createElement('button');
    digito.textContent = '+';
    inserir(digito);
    expect(document.getElementById('tela').value).toBe('');
  });

  test('Deve inserir dígito numérico quando a tela está vazia.', () => {
    const digito = document.createElement('button');
    digito.textContent = '5';
    inserir(digito);
    expect(document.getElementById('tela').value).toBe('5');
  });

  test('Deve inserir digito mesmo quando a tela já possui um operador.', () => {
    document.getElementById('tela').value = '2 + ';
    const digito = document.createElement('button');
    digito.textContent = '6';
    inserir(digito);
    expect(document.getElementById('tela').value).toBe('2 + 6');
  });

  test('Deve substituir o operador se o ultimo digito for um operador', () => {
    document.getElementById('tela').value = '1 + ';
    const digito = document.createElement('button');
    digito.textContent = '-';
    controleTela(false);
    inserir(digito);
    expect(document.getElementById('tela').value).toBe('1 - ');
  });

  test('Deve substituir o resultado na tela ao inserir um digito.', () => {
    document.getElementById('tela').value = '2 + 2 =\n4';
    controleTela(true);
    const digito = document.createElement('button');
    digito.textContent = '6';
    inserir(digito);
    expect(document.getElementById('tela').value).toBe('6');
  });
});

describe('\nTESTE DA FUNÇÃO | virgula:', () => {
  beforeEach(() => {
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Deve adicionar "0." na tela quando não há elementos', () => {
    virgula();
    expect(document.getElementById('tela').value).toBe('0.');
  });

  test('Deve adicionar "." na tela se o último elemento for um número.', () => {
    document.getElementById('tela').value = '12';
    virgula();
    expect(document.getElementById('tela').value).toBe('12.');
  });

  test('Deve adicionar zero e vírgula se o último elemento é um operador', () => {
    document.getElementById('tela').value = '12 + '; 
    virgula();
    expect(document.getElementById('tela').value).toBe('12 + 0.');
  });

  test('Deve adicionar zero e vírgula se o último elemento é um parêntese de abertura', () => {
    document.getElementById('tela').value = '(';
    virgula();
    expect(document.getElementById('tela').value).toBe('(0.');
  });

  test('Não deve adicionar vírgula se o último elemento já possui uma vírgula', () => {
    document.getElementById('tela').value = '12.5';
    virgula();
    expect(document.getElementById('tela').value).toBe('12.5');
  });
});

describe('\nTESTE DA FUNÇÃO | possuiVirgula:', () => {
  test('Deve retornar true para argumentos com vírgula decimal.', () => {
    expect(possuiVirgula('3.14')).toBe(true);
    expect(possuiVirgula('2.2')).toBe(true);
    expect(possuiVirgula('0.5')).toBe(true);
    expect(possuiVirgula('10.1')).toBe(true);
  });

  test('Deve retornar false para argumentos sem vírgula decimal.', () => {
    expect(possuiVirgula('5')).toBe(false);
    expect(possuiVirgula('7')).toBe(false);
    expect(possuiVirgula('0')).toBe(false);
  });

  test('Deve retornar false para argumentos não numéricos.', () => {
    expect(possuiVirgula('abc')).toBe(false);
    expect(possuiVirgula('1a')).toBe(false);
    expect(possuiVirgula('3.14a')).toBe(false);
    expect(possuiVirgula('2,5')).toBe(false);
  });
});

describe('\nTESTE DA FUNÇÃO | truncarNumero:', () => {
  test('Deve truncar corretamente o número com 4 casas decimais.', () => {
    expect(truncarNumero(3.14159265359)).toBe(3.1415);
    expect(truncarNumero(2.71828)).toBe(2.7182);
    expect(truncarNumero(1.23456789)).toBe(1.2345);
    expect(truncarNumero(0.123456789)).toBe(0.1234);
    expect(truncarNumero(10)).toBe(10);
  });

  test('Deve retornar 0 para números menores que 0.00005.', () => {
    expect(truncarNumero(0.00004)).toBe(0);
    expect(truncarNumero(0.00005)).toBe(0);
    expect(truncarNumero(-0.00004)).toBe(0);
    expect(truncarNumero(-0.00005)).toBe(0);
    expect(truncarNumero(-0.00006)).toBe(0);
  });

  test('Deve retornar NaN para valores não numéricos.', () => {
    expect(truncarNumero('abc')).toBeUndefined();
    expect(truncarNumero(null)).toBeUndefined();
    expect(truncarNumero(undefined)).toBeUndefined();
  });
});

describe('\nTESTE DA FUNÇÃO | mascara:', () => {
  test('Deve retornar o número formatado com a máscara correta', () => {
    // Números com casas decimais e maior que 999 devem ser formatados
    expect(mascara(1234.5678)).toBe('1,234.5678');
    expect(mascara(9876.54321)).toBe('9,876.5432');
    expect(mascara(1234567.89)).toBe('1,234,567.89');

    // Números inteiros maiores que 999 devem ser formatados
    expect(mascara(1000)).toBe('1,000.00');
    expect(mascara(10000)).toBe('10,000.00');
    expect(mascara(1000000)).toBe('1,000,000.00');

    // Números menores que 999 ou sem casas decimais não devem ser formatados
    expect(mascara(123)).toBe(123);
    expect(mascara(500)).toBe(500);
    expect(mascara(999)).toBe(999);
    expect(mascara(100)).toBe(100);
    expect(mascara(10)).toBe(10);
    expect(mascara(0)).toBe(0);
  });
});


describe('\nTESTE DA FUNÇÃO | limparTela:', () => {
  beforeEach(() => {
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Deve limpar o objeto tela no HTML.', () => {
    document.getElementById('tela').value = '123';
    limparTela();
    expect(document.getElementById('tela').value).toBe('');
  });

  test('Deve modificar a variável exibindoResultado no processo.', () => {
    controleTela(true);
    limparTela();
    expect(document.getElementById('tela').value).toBe('');
    expect(exibindoResultado).toBe(false);
  });
});

describe('\nTESTE DA FUNÇÃO | limparDigito:', () => {
  beforeEach(() => {
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Deve limpar dígito quando não está exibindo o resultado', () => {
    document.getElementById('tela').value = '123';
    limparDigito();
    expect(document.getElementById('tela').value).toBe('12');
  });

  test('Não deve limpar dígito quando está exibindo o resultado', () => {
    document.getElementById('tela').value = '123';
    controleTela(true);
    limparDigito();
    expect(document.getElementById('tela').value).toBe('123');
  });

  test('Deve limpar operador quando este é o ultimo digito na tela', () => {
    document.getElementById('tela').value = '2 + ';
    controleTela(false);
    limparDigito();
    expect(document.getElementById('tela').value).toBe('2');
  });
});

describe('\nTESTE DA FUNÇÃO | operador:', () => {
  test('Deve retornar verdadeiro para o oparadores (+, -, x, /).', () => {
    expect(operador('+')).toBe(true);
    expect(operador('-')).toBe(true);
    expect(operador('x')).toBe(true);
    expect(operador('/')).toBe(true);
  });

  test('Deve retornar falso para outro digito (1, A, @, NULO)', () => {
    expect(operador(1)).toBe(false);
    expect(operador('A')).toBe(false);
    expect(operador('@')).toBe(false);
    expect(operador(null)).toBe(false);
  });
});

describe('\nTESTE DA FUNÇÃO | pmdas:', () => {
  test('Deve retornar 1 quando receber ";" no parâmetro precedente.', () => {
    expect(pmdas(';')).toBe(1);
  });

  test('Deve retornar 2 quando receber "+" ou "-" no parâmetro precedente.', () => {
    expect(pmdas('+')).toBe(2);
    expect(pmdas('-')).toBe(2);
  });

  test('Deve retornar 3 quando receber "/" ou "x" no parâmetro precedente.', () => {
    expect(pmdas('/')).toBe(3);
    expect(pmdas('x')).toBe(3);
  });

  test('Deve retornar 0 para qualquer outro valor no parâmetro precedente.', () => {
    expect(pmdas('(')).toBe(0);
    expect(pmdas(')')).toBe(0);
    expect(pmdas('123')).toBe(0);
  });
});

describe('\nTESTE DA FUNÇÃO | substituirElementos:', () => {
  test('Deve substituir corretamente o operador "+" na string', () => {
    expect(substituirElementos('2 + 3')).toEqual(['2', '+', '3']);
  });

  test('Deve substituir corretamente o operador "-" na string', () => {
    expect(substituirElementos('5 - 2')).toEqual(['5', '-', '2']);
  });

  test('Deve substituir corretamente o operador "x" na string', () => {
    expect(substituirElementos('4 x 2')).toEqual(['4', 'x', '2']);
  });

  test('Deve substituir corretamente o operador "/" na string', () => {
    expect(substituirElementos('10 / 5')).toEqual(['10', '/', '5']);
  });

  test('Deve operar corretamente com espaços opcionais ao redor dos operadores', () => {
    expect(substituirElementos('3+4-5 x 2 / 3')).toEqual(['3', '+', '4', '-', '5', 'x', '2', '/', '3']);
  });

  test('Deve operar corretamente com múltiplos espaços opcionais entre os operadores.', () => {
    expect(substituirElementos('1    +     2')).toEqual(['1', '+', '2']);
  });
});

describe('\nTESTE DA FUNÇÃO | parseNPR:', () => {
  test('Deve converter corretamente a expressão na forma posfixa, com apenas um operador.', () => {
    expect(parseNPR(['3', '-', '2'])).toEqual(['3', '2', '-']);
  });

  test('Deve converter corretamente a expressão na forma posfixa, respeitando a ordem dos operadores.', () => {
    expect(parseNPR(['2', '+', '3', 'x', '4'])).toEqual(['2', '3', '4', 'x', '+']);
    expect(parseNPR(['5', '+', '8'])).toEqual(['5', '8', '+']);
    expect(parseNPR(['10', '+', '(', '20', 'x', '30', ')'])).toEqual(['10', '20', '30', 'x', '+']);
    expect(parseNPR(['(', '5', '+', '3', ')', 'x', '(', '7', '+', '2', ')'])).toEqual(['5', '3', '+', '7', '2', '+', 'x']);
  });

  test('Deve converter corretamente expressões mais complexas com muitos operadores.', () => {
    const expressaoInfixa = ['5', 'x', '4', '+', '3', '-', '2', '/', '1', '+', '1'];
    const resultadoEsperado = ['5', '4', 'x', '3', '+', '2', '1', '/', '-', '1', '+'];
    expect(parseNPR(expressaoInfixa)).toEqual(resultadoEsperado);
  });

  test('Deve converter corretamente expressões com uso de parênteses.', () => {
    const expressaoInfixa = ['(', '8', '+', '2', ')', 'x', '3'];
    const resultadoEsperado = ['8', '2', '+', '3', 'x'];
    expect(parseNPR(expressaoInfixa)).toEqual(resultadoEsperado);
  });

  test('Deve converter corretamente expressões com uso de exponenciação.', () => {
    const expressaoInfixa = ['2', '^', '3', '+', '4'];
    const resultadoEsperado = ['2', '3', '^', '4', '+'];
    expect(parseNPR(expressaoInfixa)).toEqual(resultadoEsperado);
  });
});

describe('\nTESTE DA FUNÇÃO | calcular:', () => {
  beforeEach(() => {
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Deve realizar a operação corretamente e exibir o resultado na tela formatado.', () => {
    document.getElementById('tela').value = '2 + 2';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 + 2 = \n4');
  });

  test('Deve ser capaz de lidar com as operações básicas.', ()=>{
    document.getElementById('tela').value = '2 + 2';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 + 2 = \n4');

    document.getElementById('tela').value = '2 - 2';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 - 2 = \n0');

    document.getElementById('tela').value = '2 x 3';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 x 3 = \n6');

    document.getElementById('tela').value = '2 ^ 3';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 ^ 3 = \n8');

    document.getElementById('tela').value = '2 / 2';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 / 2 = \n1');

    document.getElementById('tela').value = '2 % 100';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 % 100 = \n2');
  });

  test('Deve ser capaz de lidar com indeterminações.', () => {
    document.getElementById('tela').value = '1 / 0';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('1 / 0 = \n∞');
  });
});
