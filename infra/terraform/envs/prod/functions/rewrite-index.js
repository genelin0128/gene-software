function handler(event) {
  var req = event.request;
  var uri = req.uri;
  var headers = req.headers || {};
  var host = (headers.host && headers.host.value) ? headers.host.value.toLowerCase() : "";

  // 1) www 轉址到根網域（永久 301，保留路徑與查詢）
  if (host === "www.gene-software.com") {
    var location = "https://gene-software.com" + uri;
    if (req.querystring && Object.keys(req.querystring).length > 0) {
      var qs = Object.keys(req.querystring)
        .map(function(k){
          var v = req.querystring[k];
          // v 可能是 {value:"..."} 或 {multiValue:[{value:"..."}]}
          if (v && v.multiValue && v.multiValue.length > 0) {
            return v.multiValue.map(function(m){ return encodeURIComponent(k) + "=" + encodeURIComponent(m.value || ""); }).join("&");
          }
          return encodeURIComponent(k) + "=" + encodeURIComponent((v && v.value) || "");
        })
        .filter(Boolean)
        .join("&");
      if (qs.length > 0) location += "?" + qs;
    }
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: {
        "location": { "value": location },
        "cache-control": { "value": "public, max-age=300" }
      }
    };
  }

  // 2) 路徑改寫（靜態輸出）
  if (uri.endsWith('/')) {
    req.uri = uri + 'index.html';
    return req;
  }
  if (uri.indexOf('.') === -1) {
    req.uri = uri + '.html';
    return req;
  }
  return req;
}
