class DataPlatformSdk {
    envs: any;

    constructor() {
    }

    async getEnvs() {
        if (this.envs) {
            return this.envs;
        }
        try {
            const response = await fetch(import.meta.env.BASE_URL + 'environments-vars.json');
            if (!response.ok) throw new Error('Failed to fetch');
            this.envs = await response.json();
        } catch {
            this.envs = {};
        }
    }

    readArgs(): Record<string, string> {
        if (!document.location.href.includes('?')) return {};

        const queryString = document.location.href.split('?')[1];
        if (!queryString) return {};

        const params: Record<string, string> = {};
        queryString.split('&').forEach((param) => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });

        return params;
    }

    async start() {
        let queryParams: any;
        return this.getEnvs()
            .then(() => {
                queryParams = this.readArgs()
                try {
                    queryParams.token = JSON.parse(decodeURIComponent(queryParams.token))
                } catch (err) { }
                return true
            })
            .catch((err) => console.error(err))
    }
}

const sdk = new DataPlatformSdk();

export default sdk;