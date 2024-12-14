const systempersonality = data;
const defaultPersonality = systempersonality;
const systemInstructionText =
        finalInstructions || JSON.stringify(defaultPersonality);
const model = await genAI.getGenerativeModel({
        model: MODEL,
        systemInstruction: {
            role: 'system',
            parts: [{ text: systemInstructionText }],
        },
        generationConfig,
        tools: { functionDeclarations: function_declarations },
    });
const chat = model.startChat({
        history: getHistory(historyId),
        safetySettings,
    });