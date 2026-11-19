api-origin.${domain} {
  @blocked {
    not header X-Origin-Secret ${origin_secret}
  }
  respond @blocked "Forbidden" 403

  reverse_proxy localhost:3000
}
