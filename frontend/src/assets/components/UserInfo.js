/**
 * Classe UserInfo - Gerencia as informações do usuário na página
 */
export class UserInfo {
  /**
   * Construtor da classe UserInfo
   * @param {Object} selectors - Objeto com seletores dos elementos
   * @param {string} selectors.nameSelector - Seletor do elemento do nome
   * @param {string} selectors.jobSelector - Seletor do elemento da descrição/trabalho
   */
  constructor({ nameSelector, jobSelector, avatarSelector }) {
    this.nameElement = document.querySelector(nameSelector);
    this.jobElement = document.querySelector(jobSelector);
    this.avatarElement = document.querySelector(avatarSelector);
    this.userId = "";
  }

  /**
   * Retorna um objeto com as informações do usuário
   * Útil para preencher formulários de edição
    * @returns {Object} Objeto com as propriedades name, about, avatar e _id
   */
  getUserInfo() {
    return {
      name: this.nameElement.textContent,
      about: this.jobElement.textContent,
      avatar: this.avatarElement.src,
      _id: this.userId
    };
  }

  /**
   * Atualiza as informações do usuário na página
   * @param {Object} newData - Objeto com os novos dados
   * @param {string} newData.name - Novo nome do usuário
    * @param {string} newData.about - Nova descrição do usuário
    * @param {string} newData.avatar - Nova URL da foto de perfil
   */
  setUserInfo(newData) {
    if (newData.name) {
      this.nameElement.textContent = newData.name;
    }
    if (newData.about) {
      this.jobElement.textContent = newData.about;
    }
    if (newData.avatar) {
      this.avatarElement.src = newData.avatar;
    }
    if (newData._id) {
      this.userId = newData._id;
    }
  }

  getUserId() {
    return this.userId;
  }
}
