/* eslint-disable no-unused-vars */

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
export const getDocs = (route, url, extension = 'pdf') => {
    return new URL(
      `/src/documents/${route}/${url}.${extension}`,
      import.meta.url
    ).href;
  }

  export const scrollTop = () =>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  export const scrollTopPadding = () =>{
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  export const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0"; // Devuelve un valor predeterminado si price no es válido
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // export const formatPrice = (price) => {
  //   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  // };

  

  // ------------------ referencia de boleto ------------------------------------
export let boletoRefArr = [];

for(let i = 100; i <= 10000; i++)
{
    if(i >= 100 && i <= 1000){
        boletoRefArr.push(`GVI#${i}`);
    } else if(i > 1000 && i <= 10000)
    {
        boletoRefArr.push(`GV#${i}`);
    }
}
// console.log(serieSorteosArr)
export function getRandomRef(){
    let totalElements = boletoRefArr.length;

    let arrIndex = randomInt(0,totalElements);
    let removedElement = boletoRefArr.splice(arrIndex, 1);
        
    return removedElement;
}

export function randomInt(max, min){
    return Math.round(Math.random() * (max - min)) + min;
} 

//-------------------------  fin de referencias para boletos -------------------------------

  
  // export const socialMedia = {
  //  linkedin: window.open(`https://www.linkedin.com/company/muebles-jir%C3%A9h`, '_blank'),
  //  facebook: window.open(`https://www.facebook.com/profile.php?id=61560579672075`, '_blank'),
  //  instagram: window.open(``, '_blank'),
  //  tiktok: window.open(``, '_blank'),
  // } 
  
  