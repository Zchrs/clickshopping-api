import { v4 as uuidv4 } from 'uuid';

const v4options = {
    random: [
      0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36,
      0x30, 0x51
    ],
  };
export const laptops = [
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Laptop gamer 1',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
        img: 'laptop-gaming-rog',
        price: '$777,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
             'laptop-gaming-rog',
             'laptop-gaming-rog',
             'laptop-gaming-rog',
             'laptop-gaming-rog',
             'laptop-gaming-rog'
        ]
    },
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Laptop gamer 2',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
        img: 'laptop-gaming-victus',
        price: '$777,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'laptop-gaming-victus',
            'laptop-gaming-victus',
            'laptop-gaming-victus',
            'laptop-gaming-victus',
            'laptop-gaming-victus'
       ]
    },
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Laptop gamer 3',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
        img: 'laptop',
        price: '$777,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'laptop',
            'laptop',
            'laptop',
            'laptop',
            'laptop'
       ]
    },
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Laptop gamer 4',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
        img: 'laptop-gamer-lenovo',
        price: '$777,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'laptop-gamer-lenovo',
            'laptop-gamer-lenovo',
            'laptop-gamer-lenovo',
            'laptop-gamer-lenovo',
            'laptop-gamer-lenovo'
       ]
    },
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Laptop gamer 5',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
        img: 'laptop-asus',
        price: '$777,999.00',
        previousPrice: '$999,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'laptop-asus',
            'laptop-asus',
            'laptop-asus',
            'laptop-asus',
            'laptop-asus'
       ]
    },
]
export const clothingChilds = [
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Conjunto niño looney tunes blanco/verde',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Conjunto dragon ball super mouse blanco/azul',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Conjunto niño bob esponja blanco/azul',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Conjunto niño mickey mouse rojo/blanco',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Conjunto niño los pitufos blanco/azul',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Samsung Galaxy S23 Ultra',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Motorola moto g84',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Conjunto niño bob esponja blanco/azul',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Huawei Y 91',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Iphone 14 pro Max',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
         Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut 
         velit odit labore laboriosam iste officiis.`,
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
export const alimentsGrains = [
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Frijol nacional',
        description: `Frijol rojo nacional hidropondico de la más alta calidad, 100% orgánicos.`,
        img: 'frijol',
        price: '$9,999.00',
        previousPrice: '$11,999.00',
        sellingsText: 'Vendidos',
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Garbanzo nacional',
        description: `Garbanzo nacional hidropondico de la más alta calidad, 100% orgánicos.`,
        img: 'garbanzo',
        price: '$9,999.00',
        previousPrice: '$11,999.00',
        sellingsText: 'Vendidos',
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
        id: `${uuidv4(v4options.random)}`,
        title: 'Lenteja nacional',
        description: `Lenteja nacional hidropondica en bolsa nacional de la más alta calidad, 100% orgánicas.`,
        img: 'lenteja',
        price: '$9,999.00',
        previousPrice: '$11,999.00',
        sellingsText: 'Vendidos',
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
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Arveja nacional',
        description: `Arveja nacional hidropondica en bolsa nacional de la más alta calidad, 100% orgánicas.`,
        img: 'arveja',
        price: '$9,999.00',
        previousPrice: '$11,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'arveja',
            'arveja',
            'arveja',
            'arveja',
            'arveja'
       ]
    },
    {
        id: `${uuidv4(v4options.random)}`,
        title: 'Maíz nacional',
        description: `Maíz nacional de la más alta calidad, 100% orgánicos.`,
        img: 'maiz',
        price: '$9,999.00',
        previousPrice: '$11,999.00',
        sellingsText: 'Vendidos',
        sellings: '999',
        url: '/products/productId',
        thumbnails: [
            'maiz',
            'maiz',
            'maiz',
            'maiz',
            'maiz'
       ]
    },
]

