class Despesa{
  constructor(ano, mes,dia,tipo,descricao,valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo =tipo 
    this.descricao = descricao
    this.valor = valor
  }

  validarDados(){
    for(let i in this){
        if(this[i] == undefined || this[i] == '' || this[i] == null){
          return false
        }
    }
    return true
  }
}

class Bd{
  constructor() {
    let id =  localStorage.getItem('id')

    if(id === null){
      localStorage.setItem('id',0)
    }
  }
  getProximoId(){
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId) + 1
  }

   gravar(d) {
    let id = this.getProximoId()
    
    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)
    
  }

  recuperarTodosRegistros(){
    //array de despesas
    let despesas = Array()

    let id= localStorage.getItem('id')

    for(let i = 1; i<= id; i++){
      let despesa = JSON.parse(localStorage.getItem(i))     
      if(despesa === null){
        continue 
      }

      despesa.id=i
      despesas.push(despesa)

    } 
    return despesas 
  }

  pesquisar(despesa){
    let despesasFiltradas = Array()

    despesasFiltradas= this.recuperarTodosRegistros()

    
    console.log(despesasFiltradas)
    console.log(despesa)

    if(despesa.ano != ''){
      console.log('filtro ano')
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }

    if(despesa.mes != ''){
      console.log('filtro mes')
      despesasFiltradas =  despesasFiltradas.filter(d => d.mes == despesa.mes)
    }

    if(despesa.dia != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia )
    }

    if(despesa.tipo != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }
    
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }

    if(despesa.valor != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
    }

    return despesasFiltradas
  }

  remover(id){
    localStorage.removeItem(id)
  }

}

let bd =  new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById('ano')
  let mes =   document.getElementById('mes')
  let dia =  document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  )

  if(despesa.validarDados()){
    bd.gravar(despesa)
    document.getElementById('div-mensagem-1').classList.add('text-success')
    document.getElementById('titulo').innerHTML = 'Registro Inserido com Suceso'
    document.getElementById('div-mensagem-2').innerHTML=' Despesa foi cadastra com sucesso!'
    document.getElementById('botao').classList.add('btn-success')
    document.getElementById('botao').innerHTML='voltar '
    $('#modalRegistroDespesa').modal('show')
    ano.value= ""
    mes.value = ""
    dia.value = ""
    tipo.value = ""
    descricao.value = ""
    valor.value = ""
  }else{
    document.getElementById('div-mensagem-1').classList.add('text-danger')
    document.getElementById('titulo').innerHTML = 'Erro na gravacao'
    document.getElementById('div-mensagem-2').innerHTML='Existem camos obrigatorios que nao foram preenchidos'
    document.getElementById('botao').classList.add('btn-danger')
    document.getElementById('botao').innerHTML='voltar e corrigir'
    $('#modalRegistroDespesa').modal('show')
  }


}

function carregaListaDespesas(despesas = Array() , filtro = false) {

  if(despesas.length ==  0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros()
  }

  let listaDespesas = document.getElementById('listaDespesas')

    despesas.forEach((d)=> {
      let linha = listaDespesas.insertRow()
      linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
      
      switch(parseInt(d.tipo)){
        case 1 : d.tipo = 'Alimentação'
          break
        case 2 : d.tipo = 'Educação'
          break
        case 3 : d.tipo = 'Lazer'
          break
        case 4 : d.tipo = 'Saúde'
          break
        case 5 : d.tipo = 'Transporte'
          break
      }
      linha.insertCell(1).innerHTML = d.tipo
      linha.insertCell(2).innerHTML = d.descricao
      linha.insertCell(3).innerHTML = d.valor
      
      let btn = document.createElement("button")
      btn.className='btn btn-danger'
      btn.innerHTML = '<i class="fas fa-times"></i>'
      btn.id = `id_despesa${d.id}`
      btn.onclick = function() {
      
          let id = this.id.replace('id_despesa','')
          bd.remover(id)
      }
      linha.insertCell(4).append(btn)
      console.log(d)
    })
}

function pesquisaDespesa() {
  console.log('passou')
  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value
  
  // Criando objeto de despesa com os valores de pesquisa
  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  // Filtrando despesas
  let despesas = bd.pesquisar(despesa)

  this.carregaListaDespesas(despesas, true)
}

