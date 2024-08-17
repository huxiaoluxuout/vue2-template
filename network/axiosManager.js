import {requestPromise} from "@/network/axios.js";

class AxiosManager {
    constructor() {
        this.requests = new Map();
        this.pendingRequests = [];
        this.isRefreshing = false;
    }

    async request(key, url, config = {}) {
        try {
            const task = this.makeRequest(url, config);
            this.requests.set(key, task);

            const result = await task;
            console.log(`${key} 请求成功:`, result);
            return result;
        } catch (error) {
            if (error && error.code === 10000) {
                // Token 过期
                return this.handleTokenExpired(key, url, config);
            }
            console.error(`${key} 请求失败:`, error);
            this.cancelOtherRequests(key);
            throw error;
        } finally {
            this.requests.delete(key);
        }
    }

    async handleTokenExpired(key, url, config) {
        this.cancelOtherRequests(key);

        // 将当前请求添加到待处理队列
        const retryRequest = new Promise((resolve, reject) => {
            this.pendingRequests.push({ key, url, config, resolve, reject });
        });

        if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
                await this.refreshToken();
                this.isRefreshing = false;
                await this.retryPendingRequests();
            } catch (error) {
                this.isRefreshing = false;
                this.pendingRequests.forEach(request => request.reject(error));
                this.pendingRequests = [];
                throw error;
            }
        }

        return retryRequest;
    }

    async refreshToken() {
        // 实现刷新 token 的逻辑
        // 例如：const newToken = await api.refreshToken();
        // 更新存储的 token

    }

    async retryPendingRequests() {
        const requests = this.pendingRequests;
        this.pendingRequests = [];
        for (const req of requests) {
            try {
                const result = await this.makeRequest(req.url, req.config);
                req.resolve(result);
            } catch (error) {
                req.reject(error);
            }
        }
    }

    makeRequest(url, config) {
        // 在这里添加 token 到请求头
        // config.headers = { ...config.headers, Authorization: `Bearer ${getCurrentToken()}` };
        return requestPromise(url, config);
    }

    cancelOtherRequests(exceptKey) {
        for (const [key, task] of this.requests.entries()) {
            if (key !== exceptKey) {
                task.abort();
                console.log(`${key} 已中断`);
            }
        }
    }

    cancelRequest(key) {
        const task = this.requests.get(key);
        if (task) {
            task.abort();
            this.requests.delete(key);
            console.log(`${key} 已中断`);
        }
    }
}

export const requestManager = new AxiosManager();


