const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Film Site Blog API',
      version: '1.0.0',
      description: 'Film, kategori ve kullanıcı API dokümantasyonu',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Kayıt, giriş, çıkış' },
      { name: 'Users', description: 'Kullanıcı işlemleri' },
      { name: 'Films', description: 'Film işlemleri' },
      { name: 'Categories', description: 'Kategori işlemleri' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      schemas: {
        ErrorMessage: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        ValidationErrorItem: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'field' },
            msg: { type: 'string', example: 'Email zorunludur' },
            path: { type: 'string', example: 'email' },
            location: { type: 'string', example: 'body' },
            value: { type: 'string', example: '' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ValidationErrorItem',
              },
            },
          },
          example: {
            errors: [
              {
                type: 'field',
                msg: 'Email zorunludur',
                path: 'email',
                location: 'body',
              },
            ],
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'ali@mail.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string', example: 'Ali' },
            lastName: { type: 'string', example: 'Yılmaz' },
            email: { type: 'string', format: 'email', example: 'ali@mail.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
            address: { type: 'string', example: 'İstanbul' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            address: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Film: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            youtubeUrl: {
              type: 'string',
              example: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
            },
            category: { type: 'string', description: 'Category ObjectId' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        FilmCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Inception' },
            description: { type: 'string', example: 'Bilim kurgu filmi' },
            youtubeUrl: {
              type: 'string',
              example: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
            },
            category: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
          },
        },
        FilmUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            youtubeUrl: { type: 'string' },
            category: { type: 'string' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CategoryCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Aksiyon' },
            description: { type: 'string', example: 'Aksiyon filmleri' },
          },
        },
        CategoryUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;