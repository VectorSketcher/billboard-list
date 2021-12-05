export interface QueryConfig {
    text: string;
    values?: any[];
}

/**
 * String template tag that generates a parameterized query config object compatible with node-postgres (pg)
 */
export default function sqlTag(query: TemplateStringsArray, ...values: any[]): QueryConfig {
  return {
    text: query.reduce((result, part, index) => `${result}$${index}${part}`),
    values
  };
}

/**
 * Concatenate parts of a query and reassign parameter numbers
 */
export function concatSql(...queries: Array<QueryConfig | string | false | undefined>): QueryConfig {
  return queries.reduce((result: QueryConfig, query) => {
    if (!query) {
      return result;
    }

    if (typeof query === 'string' || !query.values) {
      return {
        text: `${result.text} ${query}`.trim(),
        values: result.values
      };
    }

    return {
      text: `${result.text} ${query.text.replace(/\$(\d)/g, (match, val) => `$${parseInt(val, 10) + result.values!.length}`)}`.trim(),
      values: result.values!.concat(query.values)
    };
  }, { text: '', values: [] }) as QueryConfig;
}

/**
 * Join multiple query fragments with a delimiter
 * @param delimiter defaults to comma (`,`)
 */
export function joinSql(configs: QueryConfig[], delimiter = ','): QueryConfig {
  return configs.reduce((result, val, i, arr) => concatSql(result, val, i < arr.length - 1 && delimiter), sqlTag``);
}

/**
 * If two values are identical, use the same parameter number
 */
function optimize(query: QueryConfig, collapseNulls: boolean = false): QueryConfig {
  const uniqueValues = [...new Set(query.values)];

  if (!query.values || uniqueValues.length === query.values.length) {
    return query;
  }

  const { text } = query.values.reduce((result: { text: string, numReplaced: number }, val, i) => {
    const paramRegex = new RegExp(`\\$${i + 1}`, 'g');

    if ((!collapseNulls && val === null && val !== uniqueValues[i - result.numReplaced]) ||
            (val === undefined && (val !== uniqueValues[i - result.numReplaced] || i - result.numReplaced >= uniqueValues.length))) {
      // add undefined (always) and null (if specified) back because pg doesn't like a single null parameter for multiple types without explicit casts
      const insertionIndex = i - result.numReplaced;
      uniqueValues.splice(insertionIndex, 0, val);
      return {
        text: result.text.replace(paramRegex, `$${insertionIndex + 1}`),
        numReplaced: result.numReplaced
      };
    } else if (val !== uniqueValues[i - result.numReplaced]) {
      const replacementIndex = uniqueValues.indexOf(val);
      // these checks should both always be true, but check just in case
      if (replacementIndex !== -1 && replacementIndex < i) {
        return {
          text: result.text.replace(paramRegex, `$${replacementIndex + 1}`),
          numReplaced: result.numReplaced + 1
        };
      }
    } else if (result.numReplaced > 0) {
      return {
        text: result.text.replace(paramRegex, `$${i + 1 - result.numReplaced}`),
        numReplaced: result.numReplaced
      };
    }
    return result;
  }, { text: query.text, numReplaced: 0 });

  return {
    text,
    values: uniqueValues
  };
}
