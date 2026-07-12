class Store {
  config: any;
  constructor() {
    const storedSettings = localStorage.getItem("config");
    if (storedSettings) {
      this.config = JSON.parse(this.config);
    } else {
      this.config = {};
    }
  }
  updateConfig(data: object) {
    let toset;
    if (!this.config) {
      toset = data;
    } else {
      toset = { ...this.config, ...data };
    }

    localStorage.setItem("config", JSON.stringify(toset));
  }
  get apiKey(): string | null {
    return localStorage.getItem("apiKey");
  }
  set apiKey(key: string) {
    localStorage.setItem("apiKey", key);
  }
  clearApiKey() {
    localStorage.removeItem("apiKey");
  }
}

export default new Store();
