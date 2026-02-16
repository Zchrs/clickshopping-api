export const getFile = (route, url, extension = 'svg') => {
    return new URL(
      `/src/assets/${route}/${url}.${extension}`,
      import.meta.url
    ).href;
  }
export const getImg = (route, url, extension = 'svg') => {
    return new URL(
      `/src/assets/img/${route}/${url}.${extension}`,
      import.meta.url
    ).href;
  }