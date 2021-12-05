
import { PagedResponseBody, ResponseBody } from '../types/response';
import { GET, Errors, POST, QueryParam, Path } from 'typescript-rest';
import { Tags } from 'typescript-rest-swagger';
import { InternalServerError } from 'typescript-rest/dist/server/model/errors';
import { getPagingInfo } from '../lib/getPagingInfo';
import BillboardSongsDataManager from '../managers/BillboardSongsDataManager';
import { TopOneHundred } from '../types/models/topOneHundredModel';

@Tags('Gets Top One Hundred Songs')
@Path('/toponehundred')
class TopOneHundredRouter {
  private billboardSongsDataManager: BillboardSongsDataManager = new BillboardSongsDataManager();
  /**
        * Get list of top 100 billboard songs
        * @Param offset
        * @Param limit
        */
  @GET
  async getTopOneHundred(
    @QueryParam('topOneHundredId') topOneHundredId?: string,
    @QueryParam('artist') artist?: string,
    @QueryParam('artistType') artistType?: string,
    @QueryParam('releaseYear') releaseYear?: Date,
    @QueryParam('album') album?: string,
    @QueryParam('favorite') favorite?: boolean,
    @QueryParam('offset') offset: number = 0,
    @QueryParam('limit') limit: number = 20): Promise<PagedResponseBody<TopOneHundred[]>> {
    try {
      const filter = { topOneHundredId, artist, artistType, releaseYear, album, favorite };
      const allSongs = await this.billboardSongsDataManager.getSongs(filter, { offset, limit });

      // page count of all songs
      const count = Array.prototype.push.apply(allSongs);
      return {
        data: allSongs,
        paging: getPagingInfo('/toponehundred', offset, limit, count)
      };
    } catch (err) {
      throw (err instanceof Errors.HttpError) ? err : new InternalServerError();
    }
  }

  /**
     * Create a new song to be added to list
     * @param id The ID of the Song
     * @param body The song to create
     */
  @POST
  async postTopOneHundred(body: TopOneHundred): Promise<ResponseBody<TopOneHundred>> {
    const song = new TopOneHundred(body);

    const item = await this.billboardSongsDataManager.addSongToList(song);
    return { data: item };
  }
}
export default TopOneHundredRouter;
