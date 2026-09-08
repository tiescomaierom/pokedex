// 1. Pegando os elementos do HTML
const container = document.getElementById('pokedex-container');
const btnProximo = document.getElementById('btn-proximo');
const btnVoltar = document.getElementById('btn-voltar');

// 2. Variáveis para controlar a paginação
let urlAtual = 'https://pokeapi.co/api/v2/pokemon';
let urlProximo = null;
let urlAnterior = null;

// 3. Função principal para buscar a lista de Pokémons
async function buscarPokemons(url) {
    try {
        // Busca a lista de 20 Pokémon (apenas nome e link dos detalhes)
        const resposta = await fetch(url);
        const dados = await resposta.json();

        // Atualiza as URLs de paginação para os botões saberem para onde ir
        urlProximo = dados.next;
        urlAnterior = dados.previous;
        
        // Ativa ou desativa os botões baseado na existência das páginas
        btnVoltar.disabled = !urlAnterior;
        btnProximo.disabled = !urlProximo;

        // Limpa o container antes de carregar os novos (evita lista infinita)
        container.innerHTML = '';

        // 4. Busca os detalhes de cada Pokémon (fotos, tipos, etc) simultaneamente
        const promessas = dados.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        
        // Espera TODOS os 20 Pokémons carregarem seus detalhes
        const detalhesPokemons = await Promise.all(promessas);

        // 5. Renderiza cada um na tela
        detalhesPokemons.forEach(criarCard);
        
    } catch (erro) {
        // Se a internet cair ou a API falhar, cai aqui
        console.error("Erro ao buscar os Pokémons:", erro);
        container.innerHTML = '<p>Erro ao carregar a Pokédex. Verifique sua conexão.</p>';
    }
}

// 6. Função para desenhar o HTML de cada card individual
function criarCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';

    const imagem = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    
    card.innerHTML = `
        <img src="${imagem}" alt="${pokemon.name}">
        <h3>#${pokemon.id} - ${pokemon.name}</h3>
    `;

    // NOVA LÓGICA DE CLIQUE AQUI:
    card.addEventListener('click', () => {
        // Redireciona para a pasta pokemon passando o nome na URL
        window.location.href = `pokemon/index.html?nome=${pokemon.name}`;
    });

    container.appendChild(card);
}

// 7. Configurando os cliques dos botões
btnProximo.addEventListener('click', () => {
    if (urlProximo) {
        buscarPokemons(urlProximo);
    }
});

btnVoltar.addEventListener('click', () => {
    if (urlAnterior) {
        buscarPokemons(urlAnterior);
    }
});

// 8. O "Start" do programa - Faz a primeira busca ao carregar a página
buscarPokemons(urlAtual);