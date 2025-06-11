module.exports = {
    apps: [
        {
            name: 'jitsu-frontend',
            script: 'npx',
            args: 'serve dist -p 3000',
            cwd: './',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            env_development: {
                NODE_ENV: 'development',
                PORT: 3000
            }
        },
        {
            name: 'jitsu-backend',
            script: 'npx',
            args: 'json-server --watch shipments.json --port 3001 --host 0.0.0.0',
            cwd: './',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                PORT: 3001
            },
            env_development: {
                NODE_ENV: 'development',
                PORT: 3001
            }
        }
    ]
}; 