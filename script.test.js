
const {
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
  calcular,
} = require('./script.js');

describe('\nTESTE DA FUNÇÃO | controleTela:', () => {
  test('Deve manipular a variável global exibindoResultado.', () => {
    expect(controleTela(true)).toBe(true);
    expect(controleTela(false)).toBe(false);
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

describe('\nTESTE DA FUNÇÃO | limparTela', () => {
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

describe('\nTESTE DA FUNÇÃO | limparDigito', () => {
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

describe('\nTESTE DA FUNÇÃO | mdas:', () => {
  test('Deve retornar 1 quando receber ";" no parâmetro precedente.', () => {
    expect(mdas(';')).toBe(1);
  });

  test('Deve retornar 2 quando receber "+" ou "-" no parâmetro precedente.', () => {
    expect(mdas('+')).toBe(2);
    expect(mdas('-')).toBe(2);
  });

  test('Deve retornar 3 quando receber "/" ou "x" no parâmetro precedente.', () => {
    expect(mdas('/')).toBe(3);
    expect(mdas('x')).toBe(3);
  });

  test('Deve retornar 0 para qualquer outro valor no parâmetro precedente.', () => {
    expect(mdas('(')).toBe(0);
    expect(mdas(')')).toBe(0);
    expect(mdas('123')).toBe(0);
  });
});

describe('\nTESTE DA FUNÇÃO | substituir:', () => {
  test('Deve substituir corretamente o operador "+" na string', () => {
    expect(substituir('2 + 3')).toEqual(['2', '+', '3']);
  });

  test('Deve substituir corretamente o operador "-" na string', () => {
    expect(substituir('5 - 2')).toEqual(['5', '-', '2']);
  });

  test('Deve substituir corretamente o operador "x" na string', () => {
    expect(substituir('4 x 2')).toEqual(['4', 'x', '2']);
  });

  test('Deve substituir corretamente o operador "/" na string', () => {
    expect(substituir('10 / 5')).toEqual(['10', '/', '5']);
  });

  test('Deve operar corretamente com espaços opcionais ao redor dos operadores', () => {
    expect(substituir('3+4-5 x 2 / 3')).toEqual(['3', '+', '4', '-', '5', 'x', '2', '/', '3']);
  });

  test('Deve operar corretamente com múltiplos espaços opcionais entre os operadores.', () => {
    expect(substituir('1    +     2')).toEqual(['1', '+', '2']);
  });
});

describe('\nTESTE DA FUNÇÃO | parseNPR:', () => {
  test('Deve converter corretamente a expressão na forma posfixa, com apenas um operador.', () => {
    expect(parseNPR(['3', '-', '2'])).toEqual(['3', '2', '-']);
  });

  test('Deve converter corretamente a expressão na forma posfixa, respeitando a ordem dos operadores.', () => {
    expect(parseNPR(['2', '+', '3', 'x', '4'])).toEqual(['2', '3', '4', 'x', '+']);
  });

  test('Deve converter corretamente expressões mais complexas com muitos operadores.', () => {
    const expressaoInfixa = ['5', 'x', '4', '+', '3', '-', '2', '/', '1', '+', '1'];
    const resultadoEsperado = ['5', '4', 'x', '3', '+', '2', '1', '/', '-', '1', '+'];
    expect(parseNPR(expressaoInfixa)).toEqual(resultadoEsperado);
  });
});

describe('\nTESTE DA FUNÇÃO | calcular:', () => {
  beforeEach(() => {
    document.body.innerHTML = '<textarea id="tela" class="visor" cols="25" rows="2" placeholder="_" readonly></textarea>';
  });

  test('Deve realizar a operação corretamente e exibir o resultado na tela formatado', () => {
    document.getElementById('tela').value = '2 + 2';
    controleTela(false);
    calcular();
    expect(document.getElementById('tela').value).toBe('2 + 2 = \n4');
  });
});


