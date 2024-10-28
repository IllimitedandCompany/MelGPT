// CommonJS
const getGPT4js = require("gpt4js");


const messages = [{ role: "user", content: "Who is Elon Musk?" }];
const options = {
  provider: "Nextway",
  model: "gpt-4o-free",
};

(async () => {
    const GPT4js = await getGPT4js();
  const provider = GPT4js.createProvider(options.provider);
  try {
    const text = await provider.chatCompletion(messages, options, (data) => {
      console.log(data);
    });
    console.log(text);
  } catch (error) {
    console.error("Error:", error);
  }
})();