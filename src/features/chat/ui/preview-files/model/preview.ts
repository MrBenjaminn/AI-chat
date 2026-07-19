import type {Attachments} from "@/shared";

export enum PreviewFilesVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

export enum PreviewFilesSize {
  Small = 'small',
  Default = 'default',
}

export interface PreviewFilesProps {
  variant?: PreviewFilesVariant;
  size?: PreviewFilesSize;
  files?: Attachments[]
}