// index.js
import { handleGreetingRequest } from './api/api_greeting.js';

export const handler = async (event) => {
    try {
        const authHeader = event.headers?.authorization || '';
        const token = authHeader.replace(/^Bearer\s+/, '');
        if (!token) throw new Error('No token provided');

        let body = {};
        if (event.body) {
            try {
                body = JSON.parse(event.body);
            } catch {
                body = {};
            }
        }

        const result = await handleGreetingRequest(token, body);
        return {
            statusCode: result.statusCode,
            body: JSON.stringify(result.bodyObject),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

};
