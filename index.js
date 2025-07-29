import { voiceClient } from "./client.js";
import tokens from "./tokens.js";

console.log("Starting Discord Voice Client...");

// معالجة الأخطاء العامة تبقى مفيدة دائمًا
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// هذا الجزء يبقى كما هو لتنظيف التوكنات
const cleanTokens = tokens.reduce((acc, token) => {
    const isValid = token?.token?.length > 30;
    const isDuplicate = acc.some(t => t.token === token.token);
    if (isValid && !isDuplicate) {
        acc.push(token);
    } else {
        console.warn('Invalid or duplicate token configuration:', token);
    }
    return acc;
}, []);

// هذا الجزء يبقى كما هو لتشغيل البوتات
for (const token of cleanTokens) {
    const client = new voiceClient(token);
    client.on('ready', (user) => {
        console.log(`Logged in as ${user.username}#${user.discriminator}`);
    });
    client.on('connected', () => {
        console.log('Connected to Discord');
    });
    client.on('disconnected', () => {
        console.log('Disconnected from Discord');
    });
    client.on('voiceReady', () => {
        console.log('Voice is ready');
    });
    client.on('error', (error) => {
        console.error('Error:', error);
    });
    client.on('debug', (message) => {
        // يمكنك إلغاء التعليق عن السطر التالي إذا أردت رؤية رسائل التصحيح
        // console.debug(message);
    });
    client.connect();
}
