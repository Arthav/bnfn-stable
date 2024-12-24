const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  import { ChatSession } from "@google/generative-ai";
  const { GoogleAIFileManager } = require("@google/generative-ai/server");
  
import { instruction } from "@/components/constant/instruction";

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  async function uploadToGemini(path: string, mimeType: string) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }
  
  /**
   * Waits for the given files to be active.
   *
   * Some files uploaded to the Gemini API need to be processed before they can
   * be used as prompt inputs. The status can be seen by querying the file's
   * "state" field.
   *
   * This implementation uses a simple blocking polling loop. Production code
   * should probably employ a more sophisticated approach.
   */
  async function waitForFilesActive(files: { name: string; mimeType: string }[]) {
    console.log("Waiting for file processing...");
    for (const name of files.map((file) => file.name)) {
      let file = await fileManager.getFile(name);
      while (file.state === "PROCESSING") {
        process.stdout.write(".")
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        file = await fileManager.getFile(name)
      }
      if (file.state !== "ACTIVE") {
        throw Error(`File ${file.name} failed to process`);
      }
    }
    console.log("...all files ready\n");
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: instruction["bhaktaSupport"],
  });
  
  const generationConfig = {
    temperature: 0.25,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  export async function startChat(): Promise<ChatSession> {
    const files = [
      await uploadToGemini("../public/trainData/Rencana_Induk_Pengembangan_Institut_Ilmu_Kesehatan_Bhakti_Wiyata_Kediri_RIP-IIK-BHAKTA_2021-2025.pdf", "application/pdf"),
      await uploadToGemini("../public/trainData/f5-1_RENCANA_INDUK_PENGEM_180622120916281.pdf", "application/pdf"),
    ];
  
    // Some files have a processing delay. Wait for them to be ready.
    await waitForFilesActive(files);
  
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
            {
              fileData: {
                mimeType: files[1].mimeType,
                fileUri: files[1].uri,
              },
            },
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Halo! Selamat datang di Bhakta SuperApp. Bagaimana saya bisa membantu kegiatan akademis atau administrasi kamu hari ini?\n"},
          ],
        },
      ],
    });
  
    return chatSession;
  }
  