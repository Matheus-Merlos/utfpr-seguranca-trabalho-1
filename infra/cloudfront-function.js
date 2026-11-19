function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var expectedAuth = "Basic ${auth_string}";

  if (!headers.authorization || headers.authorization.value !== expectedAuth) {
    return {
      statusCode: 401,
      statusDescription: "Unauthorized",
      headers: {
        "www-authenticate": { value: "Basic realm=\"SIGAcad\"" }
      }
    };
  }

  return request;
}
