import { v4 as uuidv4 } from 'uuid';
import { getRandomRef } from './globalActions';

const v4options = {
    random: [
      0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36,
      0x30, 0x51
    ],
  };
export const leases = [
    {
        area: '70 M2',  
        id: `${uuidv4(v4options.random)}`,
        name: 'Apartamento',
        ref: "GV#3456",
        clothingZone: '1',
        description: `
        Habitaciones amplias con closet, Habitación principal con 
        soporte para tv y baño privado encabinado.
        Baño social encabinado. 
        Sala con mueble de entretenimiento listo para utilizar.
        Comedor.
        Balcón amplio con vista hacia Bello, 
        Cocina integral con estufa en vidrio templado y horno empotrado, 
        Zona de ropas y calentador a gas.
        Puerta de seguridad.
        1 parqueadero privado cubierto
        `,
        img: 'casa',
        price: '2,000,000.00',
        address: 'Calle 34 # 34 54',
        previousPrice: '$2,500,000.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'Bello',
        furnished: 'No',
        admon: 'No',
        stratum: '3',
        quantityRooms: '3',
        closets: '3',
        shower: '1',
        quantityBathrooms: '2',
        balcony: '1',
        quantityCloset: '3',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'unidad',
             'ap2',
             'ap3',
             'ap4',
             'ap6'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Venta',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Venta',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Laptop gamer 1',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.`,
        img: 'house',
        price: '$999,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        district: 'El poblado',
        furnished: 'No',
        admon: 'No',
        stratum: '4',
        quantityRooms: '4',
        shower: '1',
        quantityBathrooms: '2',
        quantityCloset: '1',
        forecourt: '1',
        kitchen: 'Integral',
        garage: '1',
        diningRoom: '1',
        option: 'Arrendamiento',
        floor: 'Baldosa',
        thumbnails: [
             'house',
             'house',
             'house',
             'house',
             'house'
        ]
    },
]
export const clothingChilds = [
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Conjunto niño looney tunes blanco/verde',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
`,
        img: 'conjunto9',
        price: '$39,999.00',
        previousPrice: '$45,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'conjunto9',
            'conjunto9',
            'conjunto9',
            'conjunto9',
            'conjunto9'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Conjunto dragon ball super mouse blanco/azul',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
`,
        img: 'conjunto2',
        price: '$39,999.00',
        previousPrice: '$45,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'conjunto2',
            'conjunto2',
            'conjunto2',
            'conjunto2',
            'conjunto2'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Conjunto niño bob esponja blanco/azul',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
`,
        img: 'conjunto10',
        price: '$39,999.00',
        previousPrice: '$45,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'conjunto10',
            'conjunto10',
            'conjunto10',
            'conjunto10',
            'conjunto10'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Conjunto niño mickey mouse rojo/blanco',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
`,
        img: 'conjunto8',
        price: '$39,999.00',
        previousPrice: '$45,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'conjunto8',
            'conjunto8',
            'conjunto8',
            'conjunto8',
            'conjunto8'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Conjunto niño los pitufos blanco/azul',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
`,
        img: 'conjunto6',
        price: '$39,999.00',
        previousPrice: '$45,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'conjunto6',
            'conjunto6',
            'conjunto6',
            'conjunto6',
            'conjunto6'
       ]
    },
]
export const mobilePhones = [
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Samsung Galaxy S23 Ultra',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
`,
        img: 's23-ultra',
        price: '$999,999.00',
        previousPrice: '$777,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            's23-ultra',
            's23-ultra',
            's23-ultra',
            's23-ultra',
            's23-ultra'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Motorola moto g84',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
`,
        img: 'moto-g-84',
        price: '$999,999.00',
        previousPrice: '$777,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'moto-g-84',
            'moto-g-84',
            'moto-g-84',
            'moto-g-84',
            'moto-g-84'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Conjunto niño bob esponja blanco/azul',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
`,
        img: 'zflip',
        price: '$999,999.00',
        previousPrice: '$777,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'zflip',
            'zflip',
            'zflip',
            'zflip',
            'zflip'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Huawei Y 91',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
`,
        img: 'huawei-y-91',
        price: '$999,999.00',
        previousPrice: '$777,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'huawei-y-91',
            'huawei-y-91',
            'huawei-y-91',
            'huawei-y-91',
            'huawei-y-91'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Iphone 14 pro Max',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
`,
        img: 'iphone-14-pro',
        price: '$999,999.00',
        previousPrice: '$777,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'iphone-14-pro',
            'iphone-14-pro',
            'iphone-14-pro',
            'iphone-14-pro',
            'iphone-14-pro'
       ]
    },
]
export const services = [
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Arrendamientos',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Frijol rojo nacional hidropondico de la más alta calidad, 100% orgánicos.`,
        img: 'arrendamiento',
        price: '$9,999.00',   
        gsText: 'V',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'frijol',
            'frijol',
            'frijol',
            'frijol',
            'frijol'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Ventas',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Garbanzo nacional hidropondico de la más alta calidad, 100% orgánicos.`,
        img: 'ventas',
        price: '$9,999.00',
gsText: 'V',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'garbanzo',
            'garbanzo',
            'garbanzo',
            'garbanzo',
            'garbanzo'
       ]
    },
    {
      area: '70 M2',  
      id: `${uuidv4(v4options.random)}`,
        name: 'Hipoteca',
        ref: getRandomRef(),
        clothingZone: '1',
        description: `Lenteja nacional hidropondica en bolsa nacional de la más alta calidad, 100% orgánicas.`,
        img: 'hipoteca',
        price: '$9,999.00',
gsText: 'V',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'lenteja',
            'lenteja',
            'lenteja',
            'lenteja',
            'lenteja'
       ]
    },

]

export const countries = [
    {
        value: "Afghanistan",
        label: "Afganistán"
      },
      {
        value: "Albania",
        label: "Albania"
      },
      {
        value: "Algeria",
        label: "Algeria"
      },
      {
        value: "American Samoa",
        label: "Samoa Americana"
      },
      {
        value: "Andorra",
        label: "Andorra"
      },
      {
        value: "Angola",
        label: "Angola"
      },
      {
        value: "Anguilla",
        label: "Anguilla"
      },
      {
        value: "Antarctica",
        label: "Antártida"
      },
      {
        value: "Antigua and Barbuda",
        label: "Antigua y Barbuda"
      },
      {
        value: "Argentina",
        label: "Argentina"
      },
      {
        value: "Armenia",
        label: "Armenia"
      },
      {
        value: "Aruba",
        label: "Aruba"
      },
      {
        value: "Australia",
        label: "Australia"
      },
      {
        value: "Austria",
        label: "Austria"
      },
      {
        value: "Azerbaijan",
        label: "Azerbaiyán"
      },
      {
        value: "Bahamas",
        label: "Bahamas"
      },
      {
        value: "Bahrain",
        label: "Bahrein"
      },
      {
        value: "Bangladesh",
        label: "Bangladesh"
      },
      {
        value: "Barbados",
        label: "Barbados"
      },
      {
        value: "Belarus",
        label: "Bielorrusia"
      },
      {
        value: "Belgium",
        label: "Bélgica"
      },
      {
        value: "Belize",
        label: "Belice"
      },
      {
        value: "Benin",
        label: "Benín"
      },
      {
        value: "Bermuda",
        label: "Bermuda"
      },
      {
        value: "Bhutan",
        label: "Bután"
      },
      {
        value: "Bolivia",
        label: "Bolivia"
      },
      {
        value: "Bosnia and Herzegovina",
        label: "Bosnia-Herzegovina"
      },
      {
        value: "Botswana",
        label: "Botswana"
      },
      {
        value: "Brazil",
        label: "Brasil"
      },
      {
        value: "Brunei Darussalam",
        label: "Brunei"
      },
      {
        value: "Bulgaria",
        label: "Bulgaria"
      },
      {
        value: "Burkina Faso",
        label: "Burkina Faso"
      },
      {
        value: "Burundi",
        label: "Burundi"
      },
      {
        value: "Cambodia",
        label: "Camboya"
      },
      {
        value: "Cameroon",
        label: "Camerún"
      },
      {
        value: "Canada",
        label: "Canadá"
      },
      {
        value: "Cape Verde",
        label: "Cabo Verde"
      },
      {
        value: "Cayman Islands",
        label: "Islas Caimán"
      },
      {
        value: "Central African Republic",
        label: "República Centroafricana"
      },
      {
        value: "Chad",
        label: "Chad"
      },
      {
        value: "Chile",
        label: "Chile"
      },
      {
        value: "China",
        label: "China"
      },
      {
        value: "Christmas Island",
        label: "Isla de Navidad"
      },
      {
        value: "Cocos (Keeling) Islands",
        label: "Islas Cocos"
      },
      {
        value: "Colombia",
        label: "Colombia"
      },
      {
        value: "Comoros",
        label: "Comores"
      },
      {
        value: "Congo",
        label: "República del Congo"
      },
      {
        value: "Congo, The Democratic Republic of the",
        label: "República Democrática del Congo"
      },
      {
        value: "Cook Islands",
        label: "Islas Cook"
      },
      {
        value: "Costa Rica",
        label: "Costa Rica"
      },
      {
        value: "Cote D'Ivoire",
        label: "Costa de Marfíl"
      },
      {
        value: "Croatia",
        label: "Croacia"
      },
      {
        value: "Cuba",
        label: "Cuba"
      },
      {
        value: "Cyprus",
        label: "Chipre"
      },
      {
        value: "Czech Republic",
        label: "República Checa"
      },
      {
        value: "Denmark",
        label: "Dinamarca"
      },
      {
        value: "Djibouti",
        label: "Djibouti"
      },
      {
        value: "Dominica",
        label: "Dominica"
      },
      {
        value: "Dominican Republic",
        label: "República Dominicana"
      },
      {
        value: "Ecuador",
        label: "Ecuador"
      },
      {
        value: "Egypt",
        label: "Egipto"
      },
      {
        value: "El Salvador",
        label: "El Salvador"
      },
      {
        value: "Equatorial Guinea",
        label: "Guinea Ecuatorial"
      },
      {
        value: "Eritrea",
        label: "Eritrea"
      },
      {
        value: "Estonia",
        label: "Estonia"
      },
      {
        value: "Ethiopia",
        label: "Etiopía"
      },
      {
        value: "Falkland Islands (Malvinas)",
        label: "Islas Malvinas"
      },
      {
        value: "Faroe Islands",
        label: "Islas Feroe"
      },
      {
        value: "Fiji",
        label: "Fiji"
      },
      {
        value: "Finland",
        label: "Finlandia"
      },
      {
        value: "France",
        label: "Francia"
      },
      {
        value: "French Guiana",
        label: "Guyana Francesa"
      },
      {
        value: "French Polynesia",
        label: "Polinesia Francesa"
      },
      {
        value: "French Southern Territories",
        label: "Tierras Australes y Antárticas Francesas"
      },
      {
        value: "Gabon",
        label: "Gabón"
      },
      {
        value: "Gambia",
        label: "Gambia"
      },
      {
        value: "Georgia",
        label: "Georgia"
      },
      {
        value: "Germany",
        label: "Alemania"
      },
      {
        value: "Ghana",
        label: "Ghana"
      },
      {
        value: "Gibraltar",
        label: "Gibraltar"
      },
      {
        value: "Greece",
        label: "Grecia"
      },
      {
        value: "Greenland",
        label: "Groenlandia"
      },
      {
        value: "Grenada",
        label: "Granada"
      },
      {
        value: "Guadeloupe",
        label: "Guadalupe"
      },
      {
        value: "Guam",
        label: "Guam"
      },
      {
        value: "Guatemala",
        label: "Guatemala"
      },
      {
        value: "Guinea",
        label: "Guinea"
      },
      {
        value: "Guinea-Bissau",
        label: "Guinea-Bissau"
      },
      {
        value: "Guyana",
        label: "Guyana"
      },
      {
        value: "Haiti",
        label: "Haití"
      },
      {
        value: "Holy See (Vatican City State)",
        label: "Vaticano"
      },
      {
        value: "Honduras",
        label: "Honduras"
      },
      {
        value: "Hong Kong",
        label: "Hong Kong"
      },
      {
        value: "Hungary",
        label: "Hungría"
      },
      {
        value: "Iceland",
        label: "Islandia"
      },
      {
        value: "India",
        label: "India"
      },
      {
        value: "Indonesia",
        label: "Indonesia"
      },
      {
        value: "Iran, Islamic Republic Of",
        label: "Irán"
      },
      {
        value: "Iraq",
        label: "Iraq"
      },
      {
        value: "Ireland",
        label: "Irlanda"
      },
      {
        value: "Israel",
        label: "Israel"
      },
      {
        value: "Italy",
        label: "Italia"
      },
      {
        value: "Jamaica",
        label: "Jamaica"
      },
      {
        value: "Japan",
        label: "Japón"
      },
      {
        value: "Jordan",
        label: "Jordania"
      },
      {
        value: "Kazakhstan",
        label: "Kazajstán"
      },
      {
        value: "Kenya",
        label: "Kenia"
      },
      {
        value: "Kiribati",
        label: "Kiribati"
      },
      {
        value: "Korea, Democratic People'S Republic of",
        label: "Corea del Norte"
      },
      {
        value: "Korea, Republic of",
        label: "Corea del Sur"
      },
      {
        value: "Kuwait",
        label: "Kuwait"
      },
      {
        value: "Kyrgyzstan",
        label: "Kirguistán"
      },
      {
        value: "Lao People's Democratic Republic",
        label: "Laos"
      },
      {
        value: "Latvia",
        label: "Letonia"
      },
      {
        value: "Lebanon",
        label: "Líbano"
      },
      {
        value: "Lesotho",
        label: "Lesotho"
      },
      {
        value: "Liberia",
        label: "Liberia"
      },
      {
        value: "Libyan Arab Jamahiriya",
        label: "Libia"
      },
      {
        value: "Liechtenstein",
        label: "Liechtenstein"
      },
      {
        value: "Lithuania",
        label: "Lituania"
      },
      {
        value: "Luxembourg",
        label: "Luxemburgo"
      },
      {
        value: "Macao",
        label: "Macao"
      },
      {
        value: "Macedonia, The Former Yugoslav Republic of",
        label: "Macedonia"
      },
      {
        value: "Madagascar",
        label: "Madagascar"
      },
      {
        value: "Malawi",
        label: "Malawi"
      },
      {
        value: "Malaysia",
        label: "Malasia"
      },
      {
        value: "Maldives",
        label: "Maldivas"
      },
      {
        value: "Mali",
        label: "Mali"
      },
      {
        value: "Malta",
        label: "Malta"
      },
      {
        value: "Marshall Islands",
        label: "Islas Marshall"
      },
      {
        value: "Martinique",
        label: "Martinica"
      },
      {
        value: "Mauritania",
        label: "Mauritania"
      },
      {
        value: "Mauritius",
        label: "Mauricio"
      },
      {
        value: "Mayotte",
        label: "Mayotte"
      },
      {
        value: "Mexico",
        label: "México"
      },
      {
        value: "Micronesia, Federated States of",
        label: "Estados Federados de Micronesia"
      },
      {
        value: "Moldova, Republic of",
        label: "Moldavia"
      },
      {
        value: "Monaco",
        label: "Mónaco"
      },
      {
        value: "Mongolia",
        label: "Mongolia"
      },
      {
        value: "Montserrat",
        label: "Montserrat"
      },
      {
        value: "Morocco",
        label: "Marruecos"
      },
      {
        value: "Mozambique",
        label: "Mozambique"
      },
      {
        value: "Myanmar",
        label: "Myanmar"
      },
      {
        value: "Namibia",
        label: "Namibia"
      },
      {
        value: "Nauru",
        label: "Nauru"
      },
      {
        value: "Nepal",
        label: "Nepal"
      },
      {
        value: "Netherlands",
        label: "Holanda"
      },
      {
        value: "Netherlands Antilles",
        label: "Antillas Holandesas"
      },
      {
        value: "New Caledonia",
        label: "Nueva Caledonia"
      },
      {
        value: "New Zealand",
        label: "Nueva Zelanda"
      },
      {
        value: "Nicaragua",
        label: "Nicaragua"
      },
      {
        value: "Niger",
        label: "Niger"
      },
      {
        value: "Nigeria",
        label: "Nigeria"
      },
      {
        value: "Niue",
        label: "Niue"
      },
      {
        value: "Norfolk Island",
        label: "Islas Norfolk"
      },
      {
        value: "Northern Mariana Islands",
        label: "Islas Marianas del Norte"
      },
      {
        value: "Norway",
        label: "Noruega"
      },
      {
        value: "Oman",
        label: "Omán"
      },
      {
        value: "Pakistan",
        label: "Pakistán"
      },
      {
        value: "Palau",
        label: "Palau"
      },
      {
        value: "Palestinian Territory, Occupied",
        label: "Palestina"
      },
      {
        value: "Panama",
        label: "Panamá"
      },
      {
        value: "Papua New Guinea",
        label: "Papua Nueva Guinea"
      },
      {
        value: "Paraguay",
        label: "Paraguay"
      },
      {
        value: "Peru",
        label: "Perú"
      },
      {
        value: "Philippines",
        label: "Filipinas"
      },
      {
        value: "Pitcairn",
        label: "Pitcairn"
      },
      {
        value: "Poland",
        label: "Polonia"
      },
      {
        value: "Portugal",
        label: "Portugal"
      },
      {
        value: "Puerto Rico",
        label: "Puerto Rico"
      },
      {
        value: "Qatar",
        label: "Qatar"
      },
      {
        value: "Reunion",
        label: "Reunión"
      },
      {
        value: "Romania",
        label: "Rumanía"
      },
      {
        value: "Russian Federation",
        label: "Rusia"
      },
      {
        value: "Rwanda",
        label: "Ruanda"
      },
      {
        value: "Saint Helena",
        label: "Santa Helena"
      },
      {
        value: "Saint Kitts and Nevis",
        label: "San Kitts y Nevis"
      },
      {
        value: "Saint Lucia",
        label: "Santa Lucía"
      },
      {
        value: "Saint Vincent and the Grenadines",
        label: "San Vicente y Granadinas"
      },
      {
        value: "Samoa",
        label: "Samoa"
      },
      {
        value: "San Marino",
        label: "San Marino"
      },
      {
        value: "Sao Tome and Principe",
        label: "Santo Tomé y Príncipe"
      },
      {
        value: "Saudi Arabia",
        label: "Arabia Saudita"
      },
      {
        value: "Senegal",
        label: "Senegal"
      },
      {
        value: "Serbia and Montenegro",
        label: "Serbia"
      },
      {
        value: "Seychelles",
        label: "Seychelles"
      },
      {
        value: "Sierra Leone",
        label: "Sierra Leona"
      },
      {
        value: "Singapore",
        label: "Singapur"
      },
      {
        value: "Slovakia",
        label: "Eslovaquía"
      },
      {
        value: "Slovenia",
        label: "Eslovenia"
      },
      {
        value: "Solomon Islands",
        label: "Islas Salomón"
      },
      {
        value: "Somalia",
        label: "Somalia"
      },
      {
        value: "South Africa",
        label: "Sudáfrica"
      },
      {
        value: "Spain",
        label: "España"
      },
      {
        value: "Sri Lanka",
        label: "Sri Lanka"
      },
      {
        value: "Sudan",
        label: "Sudán"
      },
      {
        value: "Suriname",
        label: "Surinam"
      },
      {
        value: "Swaziland",
        label: "Swazilandia"
      },
      {
        value: "Sweden",
        label: "Suecia"
      },
      {
        value: "Switzerland",
        label: "Suiza"
      },
      {
        value: "Syrian Arab Republic",
        label: "Siria"
      },
      {
        value: "Taiwan, Province of China",
        label: "Taiwán"
      },
      {
        value: "Tajikistan",
        label: "Tadjikistan"
      },
      {
        value: "Tanzania, United Republic of",
        label: "Tanzania"
      },
      {
        value: "Thailand",
        label: "Tailandia"
      },
      {
        value: "Timor-Leste",
        label: "Timor Oriental"
      },
      {
        value: "Togo",
        label: "Togo"
      },
      {
        value: "Tokelau",
        label: "Tokelau"
      },
      {
        value: "Tonga",
        label: "Tonga"
      },
      {
        value: "Trinidad and Tobago",
        label: "Trinidad y Tobago"
      },
      {
        value: "Tunisia",
        label: "Túnez"
      },
      {
        value: "Turkey",
        label: "Turquía"
      },
      {
        value: "Turkmenistan",
        label: "Turkmenistan"
      },
      {
        value: "Turks and Caicos Islands",
        label: "Islas Turcas y Caicos"
      },
      {
        value: "Tuvalu",
        label: "Tuvalu"
      },
      {
        value: "Uganda",
        label: "Uganda"
      },
      {
        value: "Ukraine",
        label: "Ucrania"
      },
      {
        value: "United Arab Emirates",
        label: "Emiratos Árabes Unidos"
      },
      {
        value: "United Kingdom",
        label: "Reino Unido"
      },
      {
        value: "United States",
        label: "Estados Unidos"
      },
      {
        value: "Uruguay",
        label: "Uruguay"
      },
      {
        value: "Uzbekistan",
        label: "Uzbekistán"
      },
      {
        value: "Vanuatu",
        label: "Vanuatu"
      },
      {
        value: "Venezuela",
        label: "Venezuela"
      },
      {
        value: "Viet Nam",
        label: "Vietnam"
      },
      {
        value: "Virgin Islands, British",
        label: "Islas Vírgenes Británicas"
      },
      {
        value: "Virgin Islands, U.S.",
        label: "Islas Vírgenes Americanas"
      },
      {
        value: "Wallis and Futuna",
        label: "Wallis y Futuna"
      },
      {
        value: "Western Sahara",
        label: "Sáhara Occidental"
      },
      {
        value: "Yemen",
        label: "Yemen"
      },
      {
        value: "Zambia",
        label: "Zambia"
      },
      {
        value: "Zimbabwe",
        label: "Zimbabwe"
      }
]

export const propertyTypes = [
  { value: "option1", label: "Apartamento" },
  { value: "option1", label: "Apartaestudio" },
  { value: "option3", label: "Bodega" },
  { value: "option4", label: "Casa" },
  { value: "option5", label: "Casa Finca" },
  { value: "option6", label: "Casa Local" },
  { value: "option7", label: "Finca" },
  { value: "option8", label: "Local" },
  { value: "option9", label: "Oficina" },
  { value: "option10", label: "Terreno" },
]

  export const advisors = [
    { Nombre: 'Juan Pérez', Correo: 'juan@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Ana Gómez', Correo: 'ana@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Rol: 'Asesor', Estado: 'Activo' },
  ];
  export const clients = [
    { Nombre: 'Juan Pérez', Correo: 'juan@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Ana Gómez', Correo: 'ana@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luisasdfasdfasdfasdfasd@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
    { Nombre: 'Luis Martínez', Correo: 'luis@example.com', Problema: "Título problema", Rol: 'Cliente', Estado: 'Activo' },
  ];