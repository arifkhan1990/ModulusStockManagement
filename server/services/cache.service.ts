
import Redis from 'redis';
import config from '../config';
import { promisify } from 'util';

class CacheService {
  private client: any;
  private getAsync: any;
  private setexAsync: any;

  constructor() {
    this.client = Redis.createClient({
      url: config.redis?.url || 'redis://localhost:6379'
    });

    this.client.on('error', (err: Error) => {
      console.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    // Promisify Redis commands
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setexAsync = promisify(this.client.setex).bind(this.client);
  }

  async get(key: string): Promise<any> {
    try {
      const data = await this.getAsync(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, data: any, ttl: number = 3600): Promise<void> {
    try {
      await this.setexAsync(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.keys(pattern, (err: Error, keys: string[]) => {
        if (err) {
          console.error('Cache invalidation error:', err);
          return reject(err);
        }
        
        if (keys.length > 0) {
          this.client.del(keys, (err: Error) => {
            if (err) {
              console.error('Cache deletion error:', err);
              return reject(err);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }
}

export const cacheService = new CacheService();
