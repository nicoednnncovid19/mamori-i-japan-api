import { Strategy, VerifiedCallback } from 'passport-custom'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import { validateNormalTokenPhonePayload } from '../util'

@Injectable()
export class FirebaseNormalUserValidateStrategy extends PassportStrategy(
  Strategy,
  'firebase-normal-user-validate'
) {
  async validate(req: Request, done: VerifiedCallback): Promise<any> {
    const extractorFunction = ExtractJwt.fromAuthHeaderAsBearerToken()
    const token = extractorFunction(req)
    if (!token) {
      throw new UnauthorizedException('No bearer token found in the header')
    }

    let userDecodedToken: firebaseAdmin.auth.DecodedIdToken
    try {
      userDecodedToken = await firebaseAdmin.auth().verifyIdToken(token)
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }

    // Expect all normal access tokens to have phone and phone_verified data.
    validateNormalTokenPhonePayload(userDecodedToken)

    // TODO @yashmurty : Check isNormalUser custom claim.
    console.log(userDecodedToken)

    done(null, userDecodedToken)
  }
}
