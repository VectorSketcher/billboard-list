/* eslint-disable no-unused-expressions */
import app from '../src/App';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const expect = chai.expect;
const songs = '/toponehundred';

const data = {
  topOneHundredId: '5',
  artist: 'Digital Blonde',
  artistType: 'Electronic',
  album: 'DJ Mix',
  releaseYear: '2018',
  isFavorite: true
};

describe('Billboard Songs WebAPI Test', () => {
  // GET back all songs with status 200
  describe(`GET ${songs}`, () => {
    it('succeeds, as expected with 200', (done) => {
      chai.request(app).get(`${songs}`)
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
  // GET back song by id
  describe(`GET ${songs} by id`, () => {
    it('succeeds, as expected', (done) => {
      chai.request(app).get(`${songs}?topOneHundredId='${data.topOneHundredId}'&offset=0&limit=100`)
        .end((err, res) => {
          if (err) {
            // tslint:disable-next-line:no-console
            console.error('ERROR:');
            // tslint:disable-next-line:no-console
            console.error(err.response.body);
          }
          expect(res.status).to.equal(200);
          expect(res.body.data.topOneHundredId).equals(data.topOneHundredId);
          done();
        });
    });
    it('Fails - Bad Get, as expected', (done) => {
      chai.request(app).get(`${songs}/${data.topOneHundredId}`)
        .set('authorization', `Bearer BAD ${data.topOneHundredId}`)
        .end((err, res) => {
          if (err) {
            // tslint:disable-next-line:no-console
            console.error('ERROR:');
            // tslint:disable-next-line:no-console
            console.error(err.response.body);
          }
          // tslint:disable-next-line:no-unused-expression
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});
