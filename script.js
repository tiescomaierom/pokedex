const container = document.getElementById('pokedex-container');
const btnProximo = document.getElementById('btn-proximo');
const btnVoltar = document.getElementById('btn-voltar');

let urlAtual = 'https://pokeapi.co/api/v2/pokemon';
let urlProximo = null;
let urlAnterior = null;

async function buscarPokemons(url) {
    const resposta = await fetch("https://pokeapi.co/api/v2/pokemon")
    const dados = await resposta.json()

    urlProximo = dados.next 
    urlAnterior = dados.previous

    urlProximo = dados.next;
    urlAnterior = dados.previous;
    
    // Ativa/Desativa botões
    btnVoltar.disabled = !urlAnterior;
    btnProximo.disabled = !urlProximo;

    // Limpa o container antes de carregar os novos
    container.innerHTML = '';

    // 3. Busca os detalhes de cada Pokémon (fotos, tipos, etc)
    const promessas = dados.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    const detalhesPokemons = await Promise.all(promessas);

    // 4. Renderiza na tela
    detalhesPokemons.forEach(criarCard);
}
buscarPokemons()
function criarCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'card';

    // A imagem oficial fica dentro de sprites.front_default
    const imagem = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    
    card.innerHTML = `
        <img src="${imagem}" alt="${pokemon.name}">
        <h3>#${pokemon.id} - ${pokemon.name}</h3>
        <p>Tipo: ${pokemon.types.map(tipo => tipo.type.name).join(', ')}</p>
    `;

    container.appendChild(card);
}