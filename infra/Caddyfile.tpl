${domain} {
    # Frontend - arquivos estáticos
    root * /var/www/frontend

    # API - proxy reverso
    handle /api/* {
        reverse_proxy localhost:3000
    }

    # SPA fallback - tudo que não for /api/* vai para index.html
    handle {
        try_files {path} /index.html
        file_server
    }
}

www.${domain} {
    redir https://${domain}{uri} permanent
}
