import {
  displayAndRequired,
  displayAndValidatorDefaultQuantidadeSolicitada,
  FieldSettings,
  noDisplayAndNoRequired
} from "../../models/field-settings.model";
import {Validators} from "@angular/forms";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";

class Config {
  idProcedimento?: FieldSettings;
  idGrauProcedimento?: FieldSettings;
  qtdSolicitada?: FieldSettings;
  dataAtendimento?: FieldSettings;
  valorUnitarioPago?: FieldSettings;
  idAutorizacaoPrevia?: FieldSettings;
  idLaboratorio?: FieldSettings;
  idVacina?: FieldSettings;
  idEspecialidade?: FieldSettings;
  idRegiaoOdontologica?: FieldSettings;
  idPatologia?: FieldSettings;
  codigoMedicamento?: FieldSettings;
  idMedicamento?: FieldSettings;
  dosagemMedicamento?: FieldSettings;
  diasAtendidosPelaQuantidade?: FieldSettings;
  index?: FieldSettings;
  tsOperacao?: FieldSettings;
}

const defaultSettingsToAutorizacaoPrevia: Config = {
  idProcedimento: {display: true, validators: [Validators.required]},
  idGrauProcedimento: {display: true, validators: [Validators.required]},
  qtdSolicitada: {display: true, validators: [Validators.required, Validators.min(1)]},
  dataAtendimento: {display: false},
  valorUnitarioPago: {display: false},
  idAutorizacaoPrevia: {display: false},
  idLaboratorio: {display: false},
  idVacina: {display: false},
  idEspecialidade: {display: false},
  idRegiaoOdontologica: {display: false},
  idPatologia: {display: false},
  codigoMedicamento: {display: false},
  idMedicamento: {display: false},
  dosagemMedicamento: {display: false},
  diasAtendidosPelaQuantidade: {display: false},
  tsOperacao: {display: true},
  index: {display: true},
}

const defaultSettingsToReembolso: Config = {
  idProcedimento: {display: true, validators: [Validators.required]},
  idGrauProcedimento: {display: true, validators: [Validators.required]},
  qtdSolicitada: {
    display: true,
    validators: [Validators.required, Validators.min(1), Validators.minLength(3), Validators.maxLength(3)]
  },
  dataAtendimento: {display: false},
  valorUnitarioPago: {display: true, validators: [Validators.required, Validators.min(1)]},
  idAutorizacaoPrevia: {display: true, validators: [Validators.required]},
  idLaboratorio: {display: false},
  idVacina: {display: false},
  idEspecialidade: {display: false},
  idRegiaoOdontologica: {display: false},
  idPatologia: {display: false},
  codigoMedicamento: {display: false},
  dosagemMedicamento: {display: false},
  diasAtendidosPelaQuantidade: {display: false},
  tsOperacao: {display: true},
  index: {display: true},
};

const defaultSettingsEmpties: Config = {
  idProcedimento: noDisplayAndNoRequired,
  idGrauProcedimento: noDisplayAndNoRequired,
  qtdSolicitada: displayAndValidatorDefaultQuantidadeSolicitada,
  dataAtendimento: noDisplayAndNoRequired,
  valorUnitarioPago: noDisplayAndNoRequired,
  idAutorizacaoPrevia: noDisplayAndNoRequired,
  idLaboratorio: noDisplayAndNoRequired,
  idVacina: noDisplayAndNoRequired,
  idEspecialidade: noDisplayAndNoRequired,
  idRegiaoOdontologica: noDisplayAndNoRequired,
  idPatologia: noDisplayAndNoRequired,
  idMedicamento: noDisplayAndNoRequired,
  codigoMedicamento: noDisplayAndNoRequired,
  dosagemMedicamento: noDisplayAndNoRequired,
  diasAtendidosPelaQuantidade: noDisplayAndNoRequired,
  tsOperacao: noDisplayAndNoRequired,
  index: noDisplayAndNoRequired,
};

const profileComponent: { [key: number]: Config } = {
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_FISIOTERAPICA]: {
    ...defaultSettingsToAutorizacaoPrevia
  },
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_MEDICA]: {
    ...defaultSettingsToAutorizacaoPrevia
  },
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA]: {
    ...defaultSettingsToAutorizacaoPrevia,
  },
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_PAD]: {
    ...defaultSettingsToAutorizacaoPrevia
  },
  [TipoProcessoEnum.REEMBOLSO_CONSULTA]: {
    ...defaultSettingsEmpties,
    idProcedimento: displayAndRequired,
    idEspecialidade: displayAndRequired,
    valorUnitarioPago: displayAndRequired,
    idAutorizacaoPrevia: displayAndRequired,
    dataAtendimento: displayAndRequired
  },
  [TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL]: {
    ...defaultSettingsEmpties,
    idProcedimento: displayAndRequired,
    idGrauProcedimento: displayAndRequired,
    idAutorizacaoPrevia: displayAndRequired,
    valorUnitarioPago: displayAndRequired,
    dataAtendimento: displayAndRequired,
    qtdSolicitada: displayAndValidatorDefaultQuantidadeSolicitada
  },
  [TipoProcessoEnum.REEMBOLSO_MEDICAMENTO]: {
    ...defaultSettingsEmpties,
    idPatologia: displayAndRequired,
    idLaboratorio: displayAndRequired,
    codigoMedicamento: displayAndRequired,
    idMedicamento: displayAndRequired,
    qtdSolicitada: displayAndValidatorDefaultQuantidadeSolicitada,
    diasAtendidosPelaQuantidade: displayAndRequired,
    valorUnitarioPago: displayAndRequired
  },
  [TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO]: {
    ...defaultSettingsEmpties,
    idProcedimento: displayAndRequired,
    idRegiaoOdontologica: displayAndRequired,
    idAutorizacaoPrevia: displayAndRequired,
    qtdSolicitada: displayAndValidatorDefaultQuantidadeSolicitada,
    valorUnitarioPago: displayAndRequired,
    dataAtendimento: displayAndRequired

  },
  [TipoProcessoEnum.REEMBOLSO_VACINA]: {
    ...defaultSettingsEmpties,
    idProcedimento: displayAndRequired,
    idVacina: {display: true},
    qtdSolicitada: displayAndValidatorDefaultQuantidadeSolicitada,
    valorUnitarioPago: displayAndRequired,
    dataAtendimento: displayAndRequired
  }
}

interface ConfiguracaoProcedimento {
  isShowInfo: boolean,
  isShowTable: boolean
}

const configurationDefaultProcedimento = {
  isShowInfo: false,
  isShowTable: true
}

const configurationDefaultToAutorizacaoPrevia = {
  isShowInfo: true,
  isShowTable: true
}

const profileProcedimento: { [key: string]: ConfiguracaoProcedimento } = {
  [TipoProcessoEnum.REEMBOLSO_CONSULTA]: {
    ...configurationDefaultProcedimento
  },
  [TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL]: {
    ...configurationDefaultProcedimento
  },
  [TipoProcessoEnum.REEMBOLSO_MEDICAMENTO]: {
    ...configurationDefaultProcedimento
  },
  [TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO]: {
    ...configurationDefaultProcedimento
  },
  [TipoProcessoEnum.REEMBOLSO_VACINA]: {
    ...configurationDefaultProcedimento
  },
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_FISIOTERAPICA]: {
    ...configurationDefaultToAutorizacaoPrevia
  },
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_MEDICA]: {
    ...configurationDefaultToAutorizacaoPrevia
  },
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA]: {
    ...configurationDefaultToAutorizacaoPrevia
  },
  [TipoProcessoEnum.AUTORIZACAO_PREVIA_PAD]: {
    ...configurationDefaultToAutorizacaoPrevia
  }
}

export {
  defaultSettingsToAutorizacaoPrevia,
  defaultSettingsToReembolso,
  defaultSettingsEmpties,
  profileComponent,
  ConfiguracaoProcedimento,
  configurationDefaultProcedimento,
  configurationDefaultToAutorizacaoPrevia,
  profileProcedimento,
  Config
}
