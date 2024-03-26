

function formatarRespostaListaPonto(ponto) {
    return {
        mensagem: `Encontrei o seguinte ecoponto próximo de você:\n\n*${ponto.nome}*\n\n${ponto.endereco}\nCep: ${ponto.cep}\n\n*${ponto.distanceInM.toFixed(0)} metro(s) de você.*\n\nTelefone: ${ponto.telefone}\nHorário de Funcionamento: ${ponto.horario_funcionamento}.\n\nItens aceitos: ${ponto.itens_recebidos.join(', ')}`,
        location: {
            lat: ponto.latitude,
            lng: ponto.longitude
        },
        nome: ponto.nome,
        ponto: ponto
    };
}



// Função Handler para processar as mensagens
/*
    Parâmetros: let, lng, radius, filtro
*/
exports.handler = async function(context, event, callback) {
    return callback(null, {
        mensagem: `Ainda não foi implementado!`
    });

    
    /* IMPORTAR BIBLIOTECA E DEFINIR GEOLOCATION
    const geofire = require('geofire-common');
    if (!event.lat || !event.lng) {
        return response.contentType('application/json').status(200).send(JSON.stringify({
            mensagem: `Parâmetros informados para a busca estão inválidos.`
        }));
    }
    const geo = {
        lat: parseFloat(event.lat),
        lng: parseFloat(event.lng)
    };
    let center = [geo.lat, geo.lng];
    let radiusInM = event.radius ? parseInt(event.radius) : 5 * 1000; // Raio padrão de 5 km

    */


    // Carregar Arquivo com dados geolocalizados
    let json = Runtime.getAssets()['/pontosColeta.json'].open();
    let dados = JSON.parse(json);

    // // Filtrar tipos solicitados primeiro
    // const tipos = event.filtro ? event.filtro.toLowerCase().split(', ') : [];
    // if (tipos.length > 0) {
    //     dados = dados.filter(e => {
    //         return e.itens_recebidos.some(function(item) {
    //             return tipos.includes(item);
    //         });
    //     });
    // }

    /* CALCULAR E FILTRAR BLOCOS DO GEOHASH

    // Filtrar por geohash
    const bounds = geofire.geohashQueryBounds(center, radiusInM);

    let ecopontos = [];
    const promises = [];
    let i = 0;
    for (const b of bounds) {
        const items = dados.filter(d => {
            return d.geohash >= b[0] && d.geohash <= b[1]
        });
        ecopontos = ecopontos.concat(items);
    }
    */


    /* VALIDAR DISTANCIA DA GEOLOCALIZACAO E FILTRAR

    // Calcular distância de cada item encontrado
    ecopontos = ecopontos.map((e) => {
        e.distanceInKm = geofire.distanceBetween([parseFloat(e.latitude), parseFloat(e.longitude)], center);
        e.distanceInM = e.distanceInKm * 1000;
        console.log('distanceInKm', e.distanceInM);
        return e;
    });

    // Segundo filtro de distância
    ecopontos = ecopontos.filter(e => e.distanceInM <= radiusInM);
    ecopontos = ecopontos.sort((a, b) => {
        return a.distanceInM - b.distanceInM;
    });
    */

    /* SELECIONAR O PONTO MAIS PRÓXIMO
    // Selecionar o ponto de coleta mais próximo
    const pontoMaisProximo = ecopontos.length > 0 ? ecopontos[0] : null;
    if (pontoMaisProximo) {
        console.log('RESULTADO GEOHASH', pontoMaisProximo);
        return callback(null, formatarRespostaListaPonto(pontoMaisProximo));
        response.contentType('application/json').status(200).send(JSON.stringify(formatarRespostaListaPonto(pontoMaisProximo)));
    } else {
        console.log('RESULTADO GEOHASH: SEM ECOPONTO');
        return callback(null, {
            mensagem: `Não encontrei nenhum ecoponto em um raio de 5 quilômetros da sua localização.`
        });
    }
    */


};