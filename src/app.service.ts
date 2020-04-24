import { Injectable } from '@nestjs/common'
import { AppLogger } from './shared/logger/logger.service'

@Injectable()
export class AppService {
  constructor(private appLogger: AppLogger) {
    this.appLogger.setContext(AppService.name)
  }

  getHello(): string {
    this.appLogger.debug('Logged from getHello controller function')

    return 'Hello World!'
  }
}
