import { ValidationResource } from './validation-resource';

/**
 * Interface 'Provider' responsável por prover instâncias de 'ValidationResource'.
 */
export interface ValidationResourceProvider {
	/**
	 * Fabrica de instância de ValidationResource.
	 */
	new(): ValidationResource;
}

/**
 * Classe 'Provider' responsável por prover instâncias de 'ValidationResource'.
 */
export class ValidationResourceProvider implements ValidationResourceProvider { }
