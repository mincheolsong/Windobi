import { useState, useEffect } from 'react';

function GoogleOAuth() {
  const oauthSignIn = () => {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
      client_id:
        '498186565738-lrc6ha9jesqcceafp7mcltp7t7qdogr4.apps.googleusercontent.com',
      redirect_uri: 'http://localhost:1212/callback',
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/youtube',
      include_granted_scopes: 'true',
      state: 'pass-through value',
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('frameOn');

    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 500,
    });

    oauthSignIn();
  }, []);

  return <div></div>;
}

export default GoogleOAuth;
