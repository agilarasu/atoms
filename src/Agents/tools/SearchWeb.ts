import {tavily} from '@tavily/core';

const apiKey = process.env.TAVILY_API_KEY;
const searchEngine = tavily({
    apiKey: apiKey,
});

export default searchEngine;