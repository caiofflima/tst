/**
 * Não altere a target em nenhuma hipótese
 */

const PROXY_CONFIG = {
  "/siasc-api": {
    //target: "http://localhost:8080",
    target: "https://siasc-backend-novo-des.apps.nprd.caixa",
    secure: true,
    logLevel: "debug",
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;

