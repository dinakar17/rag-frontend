import { Document } from "langchain/document"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

// export type Message = {
//   id: string;
//   createdAt?: Date;
//   content: string;
//   role: "system" | "user" | "assistant" | "function";
//   runId?: string;
//   sources?: Source[];
//   name?: string;
//   function_call?: { name: string };
// };

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
  question?: string
}

export type Source = {
  url: string;
  title: string;
};

// export type Message = {
//   type: "apiMessage" | "userMessage"
//   message: string
//   isStreaming?: boolean
//   sourceDocs?: Document[]
//   question?: string
// }

export interface FileLite {
  expanded?: boolean
  name: string
  url?: string
  type?: string
  score?: number
  size?: number
  embedding?: number[] // The file embedding -- or mean embedding if there are multiple embeddings for the file
  chunks?: TextEmbedding[] // The chunks of text and their embeddings
  extractedText?: string // The extracted text from the file
}

export interface FileChunk extends TextEmbedding {
  filename: string
  score?: number
}

export interface TextEmbedding {
  text: string
  embedding: number[]
}
