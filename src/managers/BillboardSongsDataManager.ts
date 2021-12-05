/* eslint-disable prefer-const */

import { TopOneHundred, TopOneHundredResponse } from '../types/models/topOneHundredModel';
import { PagingConfig } from '../types/paging';
import db from '../config/connection';
import { Response } from 'typescript-rest-swagger';
import { OK } from 'http-status';

class BillboardSongsDataManager {
  tableName = 'top_one_hundred';

  async addSongToList(data: TopOneHundred): Promise<TopOneHundred> {
    try {
      const sql = 'INSERT INTO top_one_hundred (top_one_hundred_id, artist, artist_type, release_year, album, favorite) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
      const values = [data.topOneHundredId, data.artist, data.artistType, data.releaseYear, data.album, data.favorite];
      const result = await db.query(sql, values);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  // get songs
  async getSongs(searchParams?: any, paging?: PagingConfig): Promise<TopOneHundred[]> {
    let query;
    const chosenColumn = [];
    const filters = [];
    const searchParameters = [searchParams?.topOneHundredId, searchParams?.artist, searchParams?.artistType, searchParams?.releaseYear, searchParams?.album, searchParams?.favorite];
    const columns = ['top_one_hundred_id', 'artist', 'artist_type', 'release_year', 'album', 'favorite'];
    if (searchParameters.some(item => item !== undefined)) {
      // a way to create dynamic columns for our sql query, probably a better way for this but this loops through the searchParameters finding the index/position then compares that index to the columns, this only works because the columns position doesn't change
      for (let i = 0; i < searchParameters.length; i++) {
        if (searchParameters[i] !== undefined) {
          chosenColumn.push(columns[i]);
          filters.push(searchParameters[i]);
          continue;
        }
      }
      query = `SELECT * FROM ${this.tableName} WHERE ${chosenColumn} = '${filters}'`;
    } else {
      query = 'SELECT * FROM top_one_hundred';
    }
    try {
      let result: any;
      result = await db.query(query);
      Response(OK);
      if (result.rows) {
        return (result.rows);
      }
      return;
    } catch (err) {
      console.log(err.stack);
    }
  }
}

export default BillboardSongsDataManager;
