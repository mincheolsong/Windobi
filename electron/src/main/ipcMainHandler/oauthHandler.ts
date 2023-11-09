import { session, ipcMain } from 'electron';
import { subWindow } from '../windows';
import { resolveHtmlPath } from '../util';

const url = require('url');
const querystring = require('node:querystring');

const oauthHandelr = () => {
  const redirectUri = 'http://localhost:1212/callback';

  // Prepare to filter only the callbacks for my redirectUri
  const filter = {
    urls: [redirectUri + '*'],
  };

  // redirect가 발생하는 모든 요청을 intercept
  session.defaultSession.webRequest.onBeforeRequest(
    filter,
    (details, callback) => {
      const urlString = details.url;
      // process the callback url and get any param you need
      // Parse the URL
      const parsedUrl = url.parse(urlString);

      // Extract the query parameters
      const query = parsedUrl.hash.split('&')[1]; // Get query string after #

      // Parse the query parameters into an object
      const parsedQuery = querystring.parse(query);

      // Get the value of the access_token parameter
      const token = parsedQuery.access_token;

      ipcMain.handle('token', async () => {
        return token;
      });

      (async () => {
        await subWindow.loadURL(resolveHtmlPath('index.html'));
        subWindow.webContents.send('sub', 'music');
      })();

      // accessToken을 music 컴포넌트에 넘겨주
      // don't forget to let the request proceed
      callback({
        cancel: false,
      });
    },
  );
};

export default oauthHandelr;
