import axios from 'axios';

// Get first forked IP
// Loop:
// 1. Get ip
// 2. Check is for
// 2.1. if not work, continue search
// 2.2 If work, us this IP

/**
 * Конфигуратр для простой работы со списком IP в .env
 */
export class IPConfigurator {


    constructor (
        protected baseUrl: string,
        protected envString: string
    ) {}


    /**
     * Преобразует строку с IP (через запятую) в массив.
     * @param ipList - Строка с IP адресами.
     * @returns Массив IP-адресов или ['/'], если строка пуста.
     */
    private splitApiStringToArrayList(ipList: string): string[] {
        if (!ipList) {
            return ['/'];
        }
        return ipList.split(',').map(ip => ip.trim());
    }


    public async getFirstWorkingUrl(rawEnvString: string | undefined): Promise<string | null> {
        const urls: string = this.splitApiStringToArrayList(rawEnvString);

        for (const url of urls){
            try{
                await axios.get(url, {timeout: 1500});
                console.log(`Successfully connected to ${url}`);
                return url;
            } catch (error) {
                console.warn(`Failed to connect to ${url}: ${(error as Error).message}. Check next URL...`);
            }
        }
        console.error('All urls is not available.');
        return null;
    }
}

