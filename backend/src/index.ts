import App from './app';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Error:\n', err);
  process.exit(1);
});

// eslint-disable-next-line no-unused-vars
const app = new App();
