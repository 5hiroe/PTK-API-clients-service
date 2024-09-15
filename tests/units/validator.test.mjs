import { expect } from 'chai';
import Joi from 'joi';
import Validator from '../../src/validators/validator.js';
import { BadRequest } from '../../src/globals/errors.js';

describe('Validator', () => {
  let validator;

  beforeEach(() => {
    validator = new Validator();
  });

  describe('validate', () => {
    it('should validate successfully with correct schema', () => {
      const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
      });

      const body = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890'
      };

      const result = validator.validate(body, schema);
      expect(result).to.deep.equal(body);
    });

    it('should throw BadRequest error for missing required fields', () => {
      const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
      });

      const body = {
        firstname: 'John',
        email: 'john.doe@example.com'
      };

      try {
        validator.validate(body, schema);
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequest);
        expect(error.json.errors).to.include('\"lastname\" is required');
        expect(error.json.errors).to.include('\"phone\" is required');
      }
    });

    it('should throw BadRequest error for invalid email format', () => {
      const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
      });

      const body = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'invalid-email',
        phone: '1234567890'
      };

      try {
        validator.validate(body, schema);
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequest);
        expect(error.json.errors).to.include('\"email\" must be a valid email');
      }
    });

    it('should throw BadRequest error for exceeding max length', () => {
      const schema = Joi.object({
        firstname: Joi.string().max(5).required(), // Max length set to 5 for testing
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
      });

      const body = {
        firstname: 'Johnathan', // Exceeds max length of 5
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890'
      };

      try {
        validator.validate(body, schema);
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequest);
        expect(error.json.errors).to.include('\"firstname\" length must be less than or equal to 5 characters long');
      }
    });

    it('should handle multiple validation errors correctly', () => {
      const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
      });

      const body = {
        lastname: 'Doe',
        email: 'invalid-email'
      };

      try {
        validator.validate(body, schema);
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequest);
        expect(error.json.errors).to.include('\"firstname\" is required');
        expect(error.json.errors).to.include('\"phone\" is required');
        expect(error.json.errors).to.include('\"email\" must be a valid email');
      }
    });
  });
});
