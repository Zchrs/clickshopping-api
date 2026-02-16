import axios from "axios";
// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', 
//   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization' 
// }

export const helpHttp = () => {
  const customFetch = async (endpoint, options) => {
    const defaultHeaders = {
      // ...corsHeaders,
      Accept: "application/json",
    };

    const controller = new AbortController();
    options.signal = controller.signal;

    options.method = options.method || "GET";
    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders;

    options.data = options.body ? JSON.stringify(options.body) : undefined;
    delete options.body;

    // console.log(options);
    setTimeout(() => controller.abort(), 3000);

    try {
      const response = await axios(endpoint, options);
      return response.data;
    } catch (error) {
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
        const { status, statusText } = error.response;
        return Promise.reject({
          err: true,
          status: status || "00",
          statusText: statusText || "Ocurrió un error",
        });
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        return Promise.reject({
          err: true,
          status: "00",
          statusText: "No se recibió respuesta del servidor",
        });
      } else {
        // Se produjo un error al configurar la solicitud
        return Promise.reject({
          err: true,
          status: "00",
          statusText: "Ocurrió un error al realizar la solicitud",
        });
      }
    }
  };

  const get = (url, options = {}) => {customFetch(url, options);}

  const post = (url, options = {}) => {
    options.method = "POST";
    return customFetch(url, options);
  };

  const put = (url, options = {}) => {
    options.method = "PUT";
    return customFetch(url, options);
  };

  const del = (url, options = {}) => {
    options.method = "DELETE";
    return customFetch(url, options);
  };

  return {
    get,
    post,
    put,
    del,
  };
};
