// Global type declarations for external services

declare global {
  interface Window {
    gtag?: (command: string, action: string, options?: Record<string, any>) => void;
  }
}

export {};
