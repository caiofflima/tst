import { Storage } from '../../../app/arquitetura/shared/storage/storage';
import { Beneficiario } from '../../../app/shared/models/comum/beneficiario';

export class BeneficiarioStorage extends Storage<Beneficiario> {
    
    constructor() {
        super( Beneficiario, 'beneficiario' );
    }
    
}
