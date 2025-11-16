const request = require('supertest');
const app = require('../app');

describe('Animales API', () => {
  it('Debe crear y devolver un animal', async () => {
    const res = await request(app).post('/api/animales').send({ nombre: 'Toby', especie: 'Perro', edad: 3, peso: 10 });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Toby');
  });
});
