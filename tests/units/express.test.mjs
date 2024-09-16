// import { expect } from 'chai';
import sinon from 'sinon';
import * as expressModule from '../../src/configurations/express.js'; // Importer la configuration express
import * as mongoModule from '../../src/configurations/mongo.js'; // Importer la configuration mongo
import configure from '../../src/configurations/configuration.js'; // Importer la configuration principale

describe('Configuration', () => {
  let app;

  beforeEach(() => {
    app = {
      use: sinon.stub(),
      listen: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should configure express with the right middlewares and routes', async () => {
    // Appeler la fonction de configuration principale
    await configure(app);

    // Vérifier si les middlewares et les routes sont bien configurés
  });
});
