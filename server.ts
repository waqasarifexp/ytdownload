/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import process from 'process';
import fs from 'fs';
import http from 'http';
import path from 'path';

const debug = require('debug')('trayzen-yt-downloader:server');
import app from './src/app';

const port = normalizePort(process.env.YTDL_PORT || '3001');
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
  clearDownloadDirectory();
});
server.on('error', onError);
server.on('listening', onListening);

function clearDownloadDirectory() {
  const downloadDir = process.env.YTDL_DOWNLOAD_DIR || './downloads';

  fs.stat(downloadDir, (err: any) => {
    if (err) {
      fs.mkdirSync(downloadDir);
    }

    // delete every file except '.gitkeep' in the downloads directory
    fs.readdirSync(downloadDir).forEach((file: string) => {
      fs.unlinkSync(path.join(downloadDir, file));
    });
  });
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const portNumber = parseInt(val, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const address = server.address();
  const bind = typeof address === 'string'
    ? `pipe ${address}`
    : `port ${address ? address.port : null}`;
  debug(`Listening on ${bind}`);
}
