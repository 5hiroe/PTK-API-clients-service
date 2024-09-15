import { expect } from 'chai';
import { HttpError, BadRequest, Unauthorized, Processing, Forbidden, TooManyRequests, NotFound, Conflict } from '../../src/globals/errors.js';

describe('HttpError and subclasses', () => {

  describe('HttpError', () => {
    it('should create an instance with the correct message and status', () => {
      const error = new HttpError({ message: 'Some error', status: 500 });
      expect(error.message).to.equal('Some error');
      expect(error.status).to.equal(500);
      expect(error.json).to.deep.equal({ message: 'Some error' });
    });
  });

  describe('BadRequest', () => {
    it('should create an instance with default message and status', () => {
      const error = new BadRequest();
      expect(error.message).to.equal('Format de requête invalide.');
      expect(error.status).to.equal(400);
      expect(error.json.errors).to.deep.equal([]);
    });

    it('should create an instance with custom message and errors', () => {
      const error = new BadRequest({ message: 'Custom message', errors: ['Field required'] });
      expect(error.message).to.equal('Custom message');
      expect(error.status).to.equal(400);
      expect(error.json.errors).to.deep.equal(['Field required']);
    });
  });

  describe('Unauthorized', () => {
    it('should create an instance with default message and status', () => {
      const error = new Unauthorized();
      expect(error.message).to.equal('Crédentials invalide.');
      expect(error.status).to.equal(401);
    });

    it('should create an instance with custom message', () => {
      const error = new Unauthorized('Custom unauthorized message');
      expect(error.message).to.equal('Custom unauthorized message');
      expect(error.status).to.equal(401);
    });
  });

  describe('Processing', () => {
    it('should create an instance with default message and status', () => {
      const error = new Processing();
      expect(error.message).to.equal('En traitement.');
      expect(error.status).to.equal(102);
    });

    it('should create an instance with custom message', () => {
      const error = new Processing('Custom processing message');
      expect(error.message).to.equal('Custom processing message');
      expect(error.status).to.equal(102);
    });
  });

  describe('Forbidden', () => {
    it('should create an instance with default message and status', () => {
      const error = new Forbidden();
      expect(error.message).to.equal('Accès restreint.');
      expect(error.status).to.equal(403);
    });

    it('should create an instance with custom message', () => {
      const error = new Forbidden('Custom forbidden message');
      expect(error.message).to.equal('Custom forbidden message');
      expect(error.status).to.equal(403);
    });
  });

  describe('TooManyRequests', () => {
    it('should create an instance with default message and status', () => {
      const error = new TooManyRequests();
      expect(error.message).to.equal("Veuillez attendre afin d'effectuer une nouvelle demande.");
      expect(error.status).to.equal(429);
    });

    it('should create an instance with custom message', () => {
      const error = new TooManyRequests('Custom too many requests message');
      expect(error.message).to.equal('Custom too many requests message');
      expect(error.status).to.equal(429);
    });
  });

  describe('NotFound', () => {
    it('should create an instance with default message and status', () => {
      const error = new NotFound();
      expect(error.message).to.equal('Ressource introuvable.');
      expect(error.status).to.equal(404);
    });

    it('should create an instance with custom message', () => {
      const error = new NotFound('Custom not found message');
      expect(error.message).to.equal('Custom not found message');
      expect(error.status).to.equal(404);
    });
  });

  describe('Conflict', () => {
    it('should create an instance with default message and status', () => {
      const error = new Conflict();
      expect(error.message).to.equal('Ressource déjà existante.');
      expect(error.status).to.equal(409);
    });

    it('should create an instance with custom message', () => {
      const error = new Conflict('Custom conflict message');
      expect(error.message).to.equal('Custom conflict message');
      expect(error.status).to.equal(409);
    });
  });

});


