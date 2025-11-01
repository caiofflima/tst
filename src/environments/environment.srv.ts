// Este environment corresponde ao ambiente
// Servidor de Teste, Homologação ou Produção
export const environment = {
    server: true,
    envName: 'srv',
    version: require('../../package.json').version
};
