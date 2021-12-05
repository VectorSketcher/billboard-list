/* eslint-disable prefer-const */

import { TopOneHundred } from '../types/models/topOneHundredModel';
import { PagingConfig } from '../types/paging';
import db from '../config/connection';
import { Response } from 'typescript-rest-swagger';
import { OK } from 'http-status';
import sql, { concatSql } from '../lib/sql-tag';
class BillboardSongsDataManager {
  tableName = 'top_one_hundred';

  // used to add songs to db
  async addSongToList(data: TopOneHundred): Promise<TopOneHundred> {
    try {
      let result: any;
      const sql = 'INSERT INTO top_one_hundred (top_one_hundred_id, artist, artist_type, release_year, album, is_favorite) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
      const values = [data.topOneHundredId, data.artist, data.artistType, data.releaseYear, data.album, data.isFavorite];
      result = await db.query(sql, values);
      Response(OK);
      if (result) {
        return (result.rows[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // used to favorite or unfavorite a song
  async favorite(id: string): Promise<TopOneHundred> {
    try {
      let result: any;
      const sql = `UPDATE ${this.tableName} SET is_favorite = NOT is_favorite WHERE top_one_hundred_id = ${id} RETURNING *`;
      result = await db.query(sql);
      Response(OK);
      if (result) {
        return (result.rows[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // get songs
  async getSongs(searchParams?: any, paging?: PagingConfig): Promise<TopOneHundred[]> {
    let query;
    const chosenColumn = [];
    const filters = [];
    const searchParameters = [searchParams?.topOneHundredId, searchParams?.artist, searchParams?.artistType, searchParams?.releaseYear, searchParams?.album, searchParams?.isFavorite];
    const columns = ['top_one_hundred_id', 'artist', 'artist_type', 'release_year', 'album', 'is_favorite'];

    if (searchParameters.some(item => item !== undefined)) {
      // a way to create dynamic columns for our sql query, probably a better way for this but this loops through the searchParameters finding the index/position then compares that index to the columns, this only works because the columns position doesn't change
      for (let i = 0; i < searchParameters.length; i++) {
        if (searchParameters[i] !== undefined) {
          chosenColumn.push(columns[i]);
          filters.push(searchParameters[i]);
          continue;
        }
      }
      // used only if a filter/parameter was used
      // eslint-disable-next-line no-unused-expressions
      query = `SELECT * FROM ${this.tableName} WHERE ${chosenColumn} = '${filters}'`;
    } else {
      // used only if no filter/parameter was used, grabs all songs
      query = `SELECT * FROM top_one_hundred LIMIT ${paging.limit} OFFSET ${paging.offset}`;
    }
    try {
      let result: any;
      result = await db.query(query);
      Response(OK);
      if (result.rows) {
        return (result.rows);
      }
    } catch (err) {
      console.log(err.stack);
    }
  }
}

export default BillboardSongsDataManager;
