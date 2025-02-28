
import mongoose from 'mongoose';

// Fields that shouldn't be returned in queries unless explicitly requested
const defaultExcludedFields = ['__v', 'createdAt', 'updatedAt'];

export interface QueryOptions {
  lean?: boolean;
  cache?: boolean;
  select?: string;
  exclude?: string[];
  populate?: string | string[] | Record<string, any>[];
  limit?: number;
  skip?: number;
  sort?: string | Record<string, 1 | -1>;
}

export const optimizeQuery = <T>(
  query: mongoose.Query<any, any>,
  options: QueryOptions = {}
): mongoose.Query<T, any> => {
  const {
    lean = true,
    select,
    exclude = defaultExcludedFields,
    populate,
    limit,
    skip,
    sort
  } = options;

  // Apply field selection if provided
  if (select) {
    query.select(select);
  } else if (exclude.length > 0) {
    // Exclude fields by default
    const exclusion = exclude.reduce((acc, field) => {
      acc[field] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    query.select(exclusion);
  }

  // Apply population if needed
  if (populate) {
    if (Array.isArray(populate)) {
      if (typeof populate[0] === 'string') {
        // Array of strings
        populate.forEach(path => query.populate(path));
      } else {
        // Array of objects
        populate.forEach(popObj => query.populate(popObj));
      }
    } else if (typeof populate === 'string') {
      query.populate(populate);
    } else {
      query.populate(populate);
    }
  }

  // Apply pagination
  if (limit) {
    query.limit(limit);
  }

  if (skip) {
    query.skip(skip);
  }

  // Apply sorting
  if (sort) {
    query.sort(sort);
  }

  // Use lean queries for better performance
  if (lean) {
    query.lean();
  }

  return query as mongoose.Query<T, any>;
};

// Create optimized index suggestions for MongoDB collections
export const createIndexSuggestions = (model: mongoose.Model<any>, fields: string[]) => {
  const indexOperations = fields.map(field => ({
    createIndexes: {
      name: `${field}_index`,
      key: { [field]: 1 }
    }
  }));
  
  return indexOperations;
};

// Function to analyze query performance
export const analyzeQuery = async (
  query: mongoose.Query<any, any>,
  options: { explain?: boolean } = {}
) => {
  if (options.explain) {
    return await query.explain();
  }
  return query;
};
