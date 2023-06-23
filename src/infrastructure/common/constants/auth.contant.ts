/* eslint-disable no-unused-vars */
export enum authErrorMessages {
  USER_NOT_FOUND = 'Usuário não encontrado.',
  USER_NOT_FOUND_OR_HASH_NOT_CORRET = 'Usuário não encontrado ou hash incorreto.',
  INVALID_PASSWORD = 'Senha inválida.',
  INVALID_EMAIL_OR_PASSWPRD = 'E-mail ou senha inválidos.',
  EMAIL_OR_PASSWORD_MISSING = 'E-mail ou senha está faltando.',
  EMAIL_ALREADY_EXISTS = 'O endereço de e-mail já está em uso.',
  DOMAIN_NOT_VALID_REQUEST = 'O domínio não é válido para esta solicitação.',
  TOKEN_INVALID_OR_EXPIRED = 'A chave de acesso fornecida é inválida, expirou ou não é válida para essa operação. É necessário fazer login novamente.',
  TOKEN_INVALID_OR_EXPIRED_FORGOT_PASSWORD = 'A chave de acesso fornecida é inválida, expirou ou não é válida para essa operação. É necessário solicitar novo link de redefinição de senha.'
}
