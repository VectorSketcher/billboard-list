
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/App';
chai.use(require('chai-http'));

const expect = chai.expect;

const users = '/getusers';

describe('Users WebAPI Test', () => {
  // GET back the response
  it(`GET ${users}: succeeds, as expected with 200`, (done) => {
    chai.request(app).get(`${users}`)
      .end((err, res) => {
        if (err) {
          // tslint:disable-next-line:no-console
          console.error('ERROR:');
          // tslint:disable-next-line:no-console
          console.error(err.response.body);
        }
        expect(res.status).to.equal(200);
        done();
      });
  });
});
