// Pega o "?nome=..." da barra de endereços
const parametrosDaUrl = new URLSearchParams(window.location.search);
const nomeDoPokemon = parametrosDaUrl.get('nome');

const tela = document.getElementById('tela-detalhes');

async function carregarPokemon() {
    // Trava de segurança: se abrir a página sem nenhum pokemon na URL
    if (!nomeDoPokemon) {
        tela.innerHTML = '<h2>Nenhum Pokémon selecionado!</h2><a href="../index.html">Voltar</a>';
        return;
    }

    try {
        // Busca os dados de status
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeDoPokemon}`);
        const dadosPokemon = await resposta.json();

        // Busca a geração (URL separada)
        const respostaEspecie = await fetch(dadosPokemon.species.url);
        const dadosEspecie = await respostaEspecie.json();
        
        const geracao = dadosEspecie.generation.name;
        const hp = dadosPokemon.stats.find(s => s.stat.name === 'hp').base_stat;
        const defense = dadosPokemon.stats.find(s => s.stat.name === 'defense').base_stat;
        const forca = dadosPokemon.stats.find(s => s.stat.name === 'attack').base_stat;
        const imagem = dadosPokemon.sprites.other['official-artwork'].front_default;

        // Monta o HTML na tela
        tela.innerHTML = `
            <div class="card-detalhe">
                <button id="btn-voltar" onclick="window.location.href='../index.html'">
                    ⬅ Voltar para Pokédex
                </button>
                
                <h2>${dadosPokemon.name}</h2>
                <img src="${imagem}" alt="${dadosPokemon.name}">
                
                <div class="atributos">
                    <p><strong>Geração:</strong> ${geracao}</p>
                    <p><strong>Vida (HP):</strong> ${hp}</p>
                    <p><strong>Força (Ataque):</strong> ${forca}</p>
                    <p><strong>Defesa (Armadura):</strong> ${defense}</p>
                    </div>
            </div>
        `;
    } catch (erro) {
        // Se der problema na internet ou na API
        tela.innerHTML = '<h2>Erro ao carregar dados da API.</h2><a href="../index.html">Voltar</a>';
    }
}

// Inicia a busca
carregarPokemon();