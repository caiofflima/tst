const { spawn } = require('child_process');
const fs = require('fs');

// Limpa logs anteriores
fs.writeFileSync('saida.txt', '');
fs.writeFileSync('erros.txt', '');

const saidaStream = fs.createWriteStream('saida.txt', { flags: 'a' });
const errosStream = fs.createWriteStream('erros.txt', { flags: 'a' });

console.log('🚀 Iniciando npm start...');
console.log('📝 Salvando em: saida.txt e erros.txt\n');

const processo = spawn('npm', ['start'], {
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe']
});

processo.stdout.on('data', (data) => {
    const texto = data.toString();
    process.stdout.write(texto);
    saidaStream.write(texto);
});

processo.stderr.on('data', (data) => {
    const texto = data.toString();
    process.stderr.write('\x1b[31m' + texto + '\x1b[0m');
    errosStream.write(texto);
});

processo.on('close', (code) => {
    saidaStream.end();
    errosStream.end();
    console.log(`\n✅ Finalizado com código: ${code}`);
});