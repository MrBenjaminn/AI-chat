export interface TextTypeMessageResponse {
  type: string
  text: string
}

export interface ImageTypeResponse {
  type: string
  image_url: { url: string }
}

export interface FileTypeResponse {
  type: string
  file: { filename: string; file_data: string }
}

export interface AudioTypeResponse {
  type: string
  input_audio: { data: string; format: string }
}

export interface VideoTypeResponse {
  type: string
  video_url: { url: string }
}

export type OpenRouterMessageContent =
  | TextTypeMessageResponse
  | ImageTypeResponse
  | FileTypeResponse
  | AudioTypeResponse
  | VideoTypeResponse
