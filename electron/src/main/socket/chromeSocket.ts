import { WebSocketServer } from 'ws';

const variables = {
  established: false,
  curretActiveTitle: null,
};

const port = 22332;
const wsServer = new WebSocketServer({ port });

wsServer.on('connection', (ws) => {
  variables.established = true;

  ws.on('message', (message: string) => {
    const received = JSON.parse(message.toString());
    const { command } = received;
    if (command === 'change-tab') {
      variables.curretActiveTitle = received.value;
    }
  });

  ws.on('close', () => {
    variables.established = false;
  });
});

export { variables };
