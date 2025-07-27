declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
    }
}

declare var process: {
    env: NodeJS.ProcessEnv;
};
