import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\x1b[36m%s\x1b[0m', '=============================================================');
console.log('\x1b[36m%s\x1b[0m', ' 🚀 ProjectPartner - Unified Single Terminal Launcher        ');
console.log('\x1b[36m%s\x1b[0m', '=============================================================\n');

const nodeExec = process.execPath;
const serverScript = path.join(__dirname, 'server', 'server.js');
const viteScript = path.join(__dirname, 'client', 'node_modules', 'vite', 'bin', 'vite.js');

let serverProcess = null;
let clientProcess = null;

function streamLogger(stream, prefix, colorCode) {
  let buffer = '';
  stream.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (line.trim().length > 0) {
        console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
      }
    }
  });
}

// 1. Launch Backend API Server
console.log('\x1b[34m[STARTUP]\x1b[0m Booting Backend Service on http://localhost:5000 ...');
serverProcess = spawn(nodeExec, [serverScript], {
  cwd: path.join(__dirname, 'server'),
  env: { ...process.env, PORT: '5000' },
  stdio: ['pipe', 'pipe', 'pipe']
});

streamLogger(serverProcess.stdout, 'SERVER', '34');
streamLogger(serverProcess.stderr, 'SERVER-ERR', '31');

serverProcess.on('error', (err) => {
  console.error('\x1b[31m[SERVER FATAL]\x1b[0m Error starting server:', err.message);
});

// 2. Launch Vite Frontend Dev Server
console.log('\x1b[35m[STARTUP]\x1b[0m Booting Client (Vite) on http://localhost:5173 ...\n');
clientProcess = spawn(nodeExec, [viteScript, '--host'], {
  cwd: path.join(__dirname, 'client'),
  env: { ...process.env },
  stdio: ['pipe', 'pipe', 'pipe']
});

streamLogger(clientProcess.stdout, 'CLIENT', '35');
streamLogger(clientProcess.stderr, 'CLIENT-ERR', '33');

clientProcess.on('error', (err) => {
  console.error('\x1b[31m[CLIENT FATAL]\x1b[0m Error starting client:', err.message);
});

// Graceful multi-process termination
function killProcess(proc) {
  if (!proc || !proc.pid) return;
  if (process.platform === 'win32') {
    try {
      exec(`taskkill /pid ${proc.pid} /T /F`, () => {});
    } catch (e) {
      try { proc.kill(); } catch (_) {}
    }
  } else {
    try { proc.kill('SIGTERM'); } catch (e) {}
  }
}

function handleExit() {
  console.log('\n\x1b[33m[SHUTDOWN] Terminating servers gracefully...\x1b[0m');
  killProcess(serverProcess);
  killProcess(clientProcess);
  process.exit(0);
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', () => {
  killProcess(serverProcess);
  killProcess(clientProcess);
});
