module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      // fichier de log en cas d'erreur
      error_file: "./logs/err.log",
      // utilisation mémoire maximum : 200 Mo
      max_memory_restart: "200M",
    },
  ],
};

// Commande pour lancer avec 3 instances en parallèle :
// pm2 start ecosystem.config.js -i 3
