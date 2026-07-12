import axios, { type AxiosResponse } from "axios";

type QueueItem = {
    url: string;
    cb: (response: AxiosResponse) => void | Promise<void>;
};

class RateLimiter {
    private readonly interval: number;
    private readonly queue: QueueItem[] = [];
    private running = false;

    constructor(interval = 3000) {
        this.interval = interval;
    }

    enqueue(
        url: string,
        cb: (response: AxiosResponse) => void | Promise<void>
    ) {
        this.queue.push({ url, cb });

        if (!this.running) {
            this.process();
        }
    }

    private async process() {
        this.running = true;

        while (this.queue.length > 0) {
            const { url, cb } = this.queue.shift()!;

            try {
                const response = await axios.get(url);
                await cb(response);
            } catch (err) {
                console.error(err);
            }

            await this.sleep(this.interval);
        }

        this.running = false;
    }

    private sleep(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }
}

export default new RateLimiter()