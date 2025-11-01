import { MessageResource } from './message-resource';

/**
 * Interface 'Provider' responsável por prover instâncias de 'MessageResource'.
 */
export interface MessageResourceProvider {
	/**
	 * Fabrica de instância de MessageResource.
	 */
	new(): MessageResource;
}

/**
 * Classe 'Provider' responsável por prover instâncias de 'MessageResource'.
 */
export class MessageResourceProvider implements MessageResourceProvider { }
