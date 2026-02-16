/* eslint-disable no-debugger */
const baseUrl = import.meta.env.VITE_APP_API_URL;

// fetch usuario
 export const fetchWithoutToken = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`
    if (method === "GET") {
        return fetch( url )
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders,  
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }
}

 export const fetchWithToken = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`
    const token = localStorage.getItem('tokenUser') || '';

    if (method === "GET") {
        return fetch( url,  {
            method,
            headers: {
                // ...corsHeaders, 
                'x-token': token
            }
        })
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders, 
                'content-type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(data)
        })
    }
}

// fetch admin
export const fetchWithoutTokenAdmin = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`

    if (method === "GET") {
        return fetch( url )
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders,  
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }
}

export const fetchWithTokenAdmin = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`
    const token = localStorage.getItem('tokenAdmin') || '';
    if (method === "GET") {
        return fetch( url,  {
            method,
            headers: {
                // ...corsHeaders, 
                'x-token': token
            }
        })
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders, 
                'content-type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(data)
        })
    }
}

// fetch asesor
export const fetchWithoutTokenAdvisor = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`

    if (method === "GET") {
        return fetch( url )
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders,  
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }
}

export const fetchWithTokenAdvisor = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`
    const token = localStorage.getItem('tokenAdvisor') || '';
    if (method === "GET") {
        return fetch( url,  {
            method,
            headers: {
                // ...corsHeaders, 
                'x-token': token
            }
        })
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders, 
                'content-type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(data)
        })
    }
}
