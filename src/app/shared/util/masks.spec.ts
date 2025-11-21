import {
    CI_MASK,
    CPF_MASK,
    CNPJ_MASK,
    SIICO_MASK,
    DATA_MASK,
    DDMMYY_MASK,
    DATAHORA_MASK,
    TELEFONE_MASK,
    CELULAR_MASK,
    NIS_MASK,
    NUMERO_MASK,
    CEP_MASK,
    PROCEDIMENTO_MASK,
    COD_USUARIO_MASK,
    MATRICULA_MASK,
    MATRICULA_MASK_DIGITO,
    registeredMasks,
    Mask
  } from './masks';
  
  describe('Masks', () => {
    describe('Constantes de Máscaras - Importação Direta', () => {
    it('deve exportar CI_MASK', () => {
      expect(CI_MASK).toBeDefined();
      expect(CI_MASK).toBe('0000000000-00');
    });

    it('deve exportar CPF_MASK', () => {
      expect(CPF_MASK).toBeDefined();
      expect(CPF_MASK).toBe('000.000.000-00');
    });

    it('deve exportar CNPJ_MASK', () => {
      expect(CNPJ_MASK).toBeDefined();
      expect(CNPJ_MASK).toBe('00.000.000/0000-00');
    });

    it('deve exportar SIICO_MASK', () => {
      expect(SIICO_MASK).toBeDefined();
      expect(SIICO_MASK).toBe('0000-0');
    });

    it('deve exportar DATA_MASK', () => {
      expect(DATA_MASK).toBeDefined();
      expect(DATA_MASK).toBe('00/00/0000');
    });

    it('deve exportar DDMMYY_MASK', () => {
      expect(DDMMYY_MASK).toBeDefined();
      expect(DDMMYY_MASK).toBe('00/00/00');
    });

    it('deve exportar DATAHORA_MASK', () => {
      expect(DATAHORA_MASK).toBeDefined();
      expect(DATAHORA_MASK).toBe('00/00/0000 00:00:00');
    });

    it('deve exportar TELEFONE_MASK', () => {
      expect(TELEFONE_MASK).toBeDefined();
      expect(TELEFONE_MASK).toBe('(00) 0000-0000');
    });

    it('deve exportar CELULAR_MASK', () => {
      expect(CELULAR_MASK).toBeDefined();
      expect(CELULAR_MASK).toBe('(00) 00000-0000');
    });

    it('deve exportar NIS_MASK', () => {
      expect(NIS_MASK).toBeDefined();
      expect(NIS_MASK).toBe('00000000000');
    });

    it('deve exportar NUMERO_MASK', () => {
      expect(NUMERO_MASK).toBeDefined();
      expect(NUMERO_MASK).toBe('0000');
    });

    it('deve exportar CEP_MASK', () => {
      expect(CEP_MASK).toBeDefined();
      expect(CEP_MASK).toBe('00000-000');
    });

    it('deve exportar PROCEDIMENTO_MASK', () => {
      expect(PROCEDIMENTO_MASK).toBeDefined();
      expect(PROCEDIMENTO_MASK).toBe('0000000-0');
    });

    it('deve exportar COD_USUARIO_MASK', () => {
      expect(COD_USUARIO_MASK).toBeDefined();
      expect(COD_USUARIO_MASK).toBe('AA000000');
    });

    it('deve exportar MATRICULA_MASK', () => {
      expect(MATRICULA_MASK).toBeDefined();
      expect(MATRICULA_MASK).toBe('000000');
    });

    it('deve exportar MATRICULA_MASK_DIGITO', () => {
      expect(MATRICULA_MASK_DIGITO).toBeDefined();
      expect(MATRICULA_MASK_DIGITO).toBe('000000-0');
    });
  });
    describe('Constantes de Máscaras', () => {
      it('deve ter CI_MASK com formato correto', () => {
        expect(CI_MASK).toBe('0000000000-00');
      });
  
      it('deve ter CPF_MASK com formato correto', () => {
        expect(CPF_MASK).toBe('000.000.000-00');
      });
  
      it('deve ter CNPJ_MASK com formato correto', () => {
        expect(CNPJ_MASK).toBe('00.000.000/0000-00');
      });
  
      it('deve ter SIICO_MASK com formato correto', () => {
        expect(SIICO_MASK).toBe('0000-0');
      });
  
      it('deve ter DATA_MASK com formato correto', () => {
        expect(DATA_MASK).toBe('00/00/0000');
      });
  
      it('deve ter DDMMYY_MASK com formato correto', () => {
        expect(DDMMYY_MASK).toBe('00/00/00');
      });
  
      it('deve ter DATAHORA_MASK com formato correto', () => {
        expect(DATAHORA_MASK).toBe('00/00/0000 00:00:00');
      });
  
      it('deve ter TELEFONE_MASK com formato correto', () => {
        expect(TELEFONE_MASK).toBe('(00) 0000-0000');
      });
  
      it('deve ter CELULAR_MASK com formato correto', () => {
        expect(CELULAR_MASK).toBe('(00) 00000-0000');
      });
  
      it('deve ter NIS_MASK com formato correto', () => {
        expect(NIS_MASK).toBe('00000000000');
      });
  
      it('deve ter NUMERO_MASK com formato correto', () => {
        expect(NUMERO_MASK).toBe('0000');
      });
  
      it('deve ter CEP_MASK com formato correto', () => {
        expect(CEP_MASK).toBe('00000-000');
      });
  
      it('deve ter PROCEDIMENTO_MASK com formato correto', () => {
        expect(PROCEDIMENTO_MASK).toBe('0000000-0');
      });
  
      it('deve ter COD_USUARIO_MASK com formato correto', () => {
        expect(COD_USUARIO_MASK).toBe('AA000000');
      });
  
      it('deve ter MATRICULA_MASK com formato correto', () => {
        expect(MATRICULA_MASK).toBe('000000');
      });
  
      it('deve ter MATRICULA_MASK_DIGITO com formato correto', () => {
        expect(MATRICULA_MASK_DIGITO).toBe('000000-0');
      });
    });
  
    describe('registeredMasks', () => {
      it('deve conter todas as máscaras registradas', () => {
        expect(registeredMasks).toBeDefined();
        expect(Object.keys(registeredMasks).length).toBe(16);
      });
  
      it('deve ter ciMask mapeada corretamente', () => {
        expect(registeredMasks.ciMask).toBe(CI_MASK);
        expect(registeredMasks.ciMask).toBe('0000000000-00');
      });
  
      it('deve ter cpfMask mapeada corretamente', () => {
        expect(registeredMasks.cpfMask).toBe(CPF_MASK);
        expect(registeredMasks.cpfMask).toBe('000.000.000-00');
      });
  
      it('deve ter cnpjMask mapeada corretamente', () => {
        expect(registeredMasks.cnpjMask).toBe(CNPJ_MASK);
        expect(registeredMasks.cnpjMask).toBe('00.000.000/0000-00');
      });
  
      it('deve ter siicoMask mapeada corretamente', () => {
        expect(registeredMasks.siicoMask).toBe(SIICO_MASK);
        expect(registeredMasks.siicoMask).toBe('0000-0');
      });
  
      it('deve ter dataMask mapeada corretamente', () => {
        expect(registeredMasks.dataMask).toBe(DATA_MASK);
        expect(registeredMasks.dataMask).toBe('00/00/0000');
      });
  
      it('deve ter ddMMyyMask mapeada corretamente', () => {
        expect(registeredMasks.ddMMyyMask).toBe(DDMMYY_MASK);
        expect(registeredMasks.ddMMyyMask).toBe('00/00/00');
      });
  
      it('deve ter dataHoraMask mapeada corretamente', () => {
        expect(registeredMasks.dataHoraMask).toBe(DATAHORA_MASK);
        expect(registeredMasks.dataHoraMask).toBe('00/00/0000 00:00:00');
      });
  
      it('deve ter telefoneMask mapeada corretamente', () => {
        expect(registeredMasks.telefoneMask).toBe(TELEFONE_MASK);
        expect(registeredMasks.telefoneMask).toBe('(00) 0000-0000');
      });
  
      it('deve ter celularMask mapeada corretamente', () => {
        expect(registeredMasks.celularMask).toBe(CELULAR_MASK);
        expect(registeredMasks.celularMask).toBe('(00) 00000-0000');
      });
  
      it('deve ter nisMask mapeada corretamente', () => {
        expect(registeredMasks.nisMask).toBe(NIS_MASK);
        expect(registeredMasks.nisMask).toBe('00000000000');
      });
  
      it('deve ter numeroMask mapeada corretamente', () => {
        expect(registeredMasks.numeroMask).toBe(NUMERO_MASK);
        expect(registeredMasks.numeroMask).toBe('0000');
      });
  
      it('deve ter cepMask mapeada corretamente', () => {
        expect(registeredMasks.cepMask).toBe(CEP_MASK);
        expect(registeredMasks.cepMask).toBe('00000-000');
      });
  
      it('deve ter procedimentoMask mapeada corretamente', () => {
        expect(registeredMasks.procedimentoMask).toBe(PROCEDIMENTO_MASK);
        expect(registeredMasks.procedimentoMask).toBe('0000000-0');
      });
  
      it('deve ter codigoUsuarioMask mapeada corretamente', () => {
        expect(registeredMasks.codigoUsuarioMask).toBe(COD_USUARIO_MASK);
        expect(registeredMasks.codigoUsuarioMask).toBe('AA000000');
      });
  
      it('deve ter matriculaMask mapeada corretamente', () => {
        expect(registeredMasks.matriculaMask).toBe(MATRICULA_MASK);
        expect(registeredMasks.matriculaMask).toBe('000000');
      });
  
      it('deve ter matriculaMaskDisk mapeada corretamente', () => {
        expect(registeredMasks.matriculaMaskDisk).toBe(MATRICULA_MASK_DIGITO);
        expect(registeredMasks.matriculaMaskDisk).toBe('000000-0');
      });
    });
  
    describe('Type Mask', () => {
      it('deve aceitar valores válidos do tipo Mask', () => {
        const validMasks: Mask[] = [
          'ciMask',
          'cpfMask',
          'cnpjMask',
          'siicoMask',
          'dataMask',
          'ddMMyyMask',
          'dataHoraMask',
          'telefoneMask',
          'celularMask',
          'nisMask',
          'numeroMask',
          'cepMask',
          'procedimentoMask',
          'codigoUsuarioMask',
          'matriculaMask',
          'matriculaMaskDisk'
        ];
  
        validMasks.forEach(mask => {
          expect(registeredMasks[mask]).toBeDefined();
        });
      });
  
      it('deve permitir acessar máscaras usando o tipo Mask', () => {
        const maskKey: Mask = 'cpfMask';
        const maskValue = registeredMasks[maskKey];
        
        expect(maskValue).toBe('000.000.000-00');
      });
    });
  
    describe('Integridade das Máscaras', () => {
      it('todas as máscaras devem ser strings', () => {
        Object.values(registeredMasks).forEach(mask => {
          expect(typeof mask).toBe('string');
        });
      });
  
      it('nenhuma máscara deve ser vazia', () => {
        Object.values(registeredMasks).forEach(mask => {
          expect(mask.length).toBeGreaterThan(0);
        });
      });
  
      it('máscaras devem conter apenas caracteres válidos do ngx-mask', () => {
        const validChars = /^[0A\s\-\/\.\(\)\:]+$/;
        
        Object.values(registeredMasks).forEach(mask => {
          expect(mask).toMatch(validChars);
        });
      });
    });
  });