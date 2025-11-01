import { JwtHelperService } from '@auth0/angular-jwt';

import { JwtTokenClaims } from "./jwt-token-claims";

export class JwtToken {
	public token: string ;
	public recursos: string[] ;
	public tempoMinimoRenovacao: number ;
	
	getClaims(jwtHelperService: JwtHelperService): JwtTokenClaims {
		return new JwtTokenClaims(jwtHelperService.decodeToken(this.token));
	}
}
