
export const environment = {
    production: false,
    mfe: {
        'duty-allotment': 'http://localhost:4233',
    },
    publicPath: 'http://localhost:4233/',

    // =========================================================================
    // BACKEND INTEGRATION SLOT (EDIT AS NEEDED FOR TESTING)
    // =========================================================================
    // Option A (Same WiFi IP):  'http://172.21.14.247:8080/kjusys-api'
    // Option B (Ngrok Gateway): 'https://<your-subdomain>.ngrok-free.app/kjusys-api'
    baseUrl: 'http://10.245.133.24:8080/kjusys-api',

    // WebSocket endpoint slot
    // Option A (Same WiFi IP):  'ws://172.21.14.247:8080/kjusys-api'
    // Option B (Ngrok Gateway): 'wss://<your-subdomain>.ngrok-free.app/kjusys-api'
    wsUrl: 'ws://10.245.133.24:8080/kjusys-api',
    // =========================================================================

    project: 'duty-allotment',
    baseRoute: 'kjusys',
    local: false,
    apirefreshUrl: 'http://10.245.133.24:8080/kjusys-api/authnauthz/refresh-access-token'
};
