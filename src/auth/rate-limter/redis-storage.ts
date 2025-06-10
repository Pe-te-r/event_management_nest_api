import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private redis: Redis;
  
  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.getOrThrow<string>('REDIS_URL');
    this.redis = new Redis(redisUrl);
  }

  async getRecord(key: string): Promise<number[]> {
    const record = await this.redis.lrange(key, 0, -1);
    return record.map(Number);
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const now = Date.now();
    await this.redis.rpush(key, now.toString());
    await this.redis.expire(key, ttl);
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    // throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const now = Date.now();

    await this.redis.rpush(key, now.toString());
    // await this.redis.expire(key, ttl);
    await this.redis.expire(key, Math.ceil(ttl / 1000));


    const count = await this.redis.llen(key);
    const timeLeft = await this.redis.ttl(key); 

    console.log('here',ttl)

    const isBlocked = count > limit;

    return {
      totalHits: count,
      timeToExpire: Math.ceil(ttl / 1000),
      isBlocked,
      timeToBlockExpire: isBlocked ? blockDuration : 0,
    };
  }

}
